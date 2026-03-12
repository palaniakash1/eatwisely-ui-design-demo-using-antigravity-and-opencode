import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import resources from '@opentelemetry/resources';
const { Resource } = resources;
import semConventions from '@opentelemetry/semantic-conventions';
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = semConventions;
import config from './config.js';

let sdk;
let tracer;

export const initTracing = async () => {
  if (!config.tracing.enabled) {
    console.log('Tracing disabled, skipping initialization');
    return;
  }

  try {
    const serviceName = config.tracing.serviceName;
    const serviceVersion = config.tracing.serviceVersion;

    const resource = new Resource({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion
    });

    const instrumentations = [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new MongooseInstrumentation(),
      new IORedisInstrumentation(),
      getNodeAutoInstrumentations()
    ];

    const exporters = [];

    if (config.tracing.jaegerEndpoint) {
      exporters.push(
        new JaegerExporter({
          endpoint: config.tracing.jaegerEndpoint
        })
      );
    }

    exporters.push(
      new PrometheusExporter({
        port: 9464,
        endpoint: '/metrics'
      })
    );

    sdk = new NodeSDK({
      resource,
      instrumentations,
      exporters
    });

    await sdk.start();

    tracer = trace.getTracer(serviceName);

    console.log('Tracing initialized successfully');
  } catch (error) {
    console.error('Failed to initialize tracing:', error);
  }
};

export const shutdownTracing = async () => {
  if (sdk) {
    await sdk.shutdown();
    console.log('Tracing shutdown complete');
  }
};

export const tracingMiddleware = (req, res, next) => {
  if (!tracer) {
    return next();
  }

  const span = tracer.startSpan(`${req.method} ${req.path}`, {
    kind: 1,
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.route': req.route?.path || '',
      'http.target': req.path
    }
  });

  const originalEnd = res.end;
  res.end = function (...args) {
    span.setAttribute('http.status_code', res.statusCode);
    span.setStatus(
      res.statusCode >= 400
        ? { code: SpanStatusCode.ERROR, message: 'Error' }
        : { code: SpanStatusCode.OK }
    );
    span.end();
    originalEnd.apply(this, args);
  };

  next();
};

export const createTrace = (name) => {
  return tracer?.startSpan(name) || null;
};

export const addTraceEvent = (span, event) => {
  span?.addEvent(event);
};
