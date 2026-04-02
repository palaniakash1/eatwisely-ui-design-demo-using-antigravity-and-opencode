import { useCallback, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import { Modal, Button } from 'flowbite-react';
import imageCompression from 'browser-image-compression';
import { HiCheck, HiPencil } from 'react-icons/hi';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageUploadCropper({
  onCropComplete,
  aspectRatio,
  maxFileSizeMB = 2,
  maxWidthOrHeight = 1920,
  compressOptions,
  triggerButton,
  buttonText = 'Upload Image',
  buttonClassName = '',
  modalTitle = 'Edit Image',
  children,
  cropCircular = false,
  showButton = false
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef(null);
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setIsModalOpen(true);
      setCrop(undefined);
      setCompletedCrop(null);
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    if (aspectRatio) {
      const cropWidth = 80;
      const cropHeight = cropWidth / aspectRatio;
      const x = (100 - cropWidth) / 2;
      const y = (100 - cropHeight) / 2;

      setCrop({
        unit: '%',
        width: cropWidth,
        height: cropHeight,
        x: x,
        y: Math.max(0, y)
      });
    } else {
      setCrop({
        unit: '%',
        width: 80,
        height: 60,
        x: 10,
        y: 20
      });
    }
  }, [aspectRatio]);

  const handleCropChange = useCallback((c) => {
    setCrop(c);
  }, []);

  const handleCropComplete = useCallback((c) => {
    if (!imgRef.current || !c.width || !c.height) return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelCrop = {
      x: c.x * scaleX,
      y: c.y * scaleY,
      width: c.width * scaleX,
      height: c.height * scaleY
    };

    setCompletedCrop(pixelCrop);
  }, []);

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92)
      );

      if (!blob) throw new Error('Blob creation failed');

      let file = new File([blob], `cropped_${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        file = await imageCompression(file, {
          maxSizeMB: maxFileSizeMB,
          maxWidthOrHeight,
          useWebWorker: true,
          ...compressOptions
        });
      }

      onCropComplete(file);
      handleCancel();
    } catch (err) {
      console.error('Crop error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const cropAspectRatio = aspectRatio || undefined;

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={inputRef}
        hidden
      />

      {showButton && (
        triggerButton ? (
          <div onClick={() => inputRef.current?.click()}>{triggerButton}</div>
        ) : (
          <Button 
            onClick={() => inputRef.current?.click()}
            className={buttonClassName}
          >
            {buttonText}
          </Button>
        )
      )}

      {children && (
        <div onClick={() => inputRef.current?.click()}>{children}</div>
      )}

      <Modal show={isModalOpen} onClose={handleCancel} size="2xl" popup>
        <Modal.Header className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8fa31e]/10 rounded-xl flex items-center justify-center">
              <HiPencil className="w-5 h-5 text-[#8fa31e]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{modalTitle}</h3>
              <p className="text-xs text-gray-500">
                Drag the crop box to select your image area
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="p-6 bg-gray-100">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div
              className="relative flex justify-center items-center bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden"
              style={{ minHeight: '400px' }}
            >
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={handleCropChange}
                  onComplete={handleCropComplete}
                  aspect={cropAspectRatio}
                  circularCrop={cropCircular}
                  keepSelection={true}
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="object-contain max-h-[50vh]"
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              color="gray"
              onClick={handleCancel}
              disabled={isProcessing}
              className="!rounded-xl !px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropConfirm}
              disabled={isProcessing || !completedCrop}
              className="!bg-[#8fa31e] !text-white hover:!bg-[#7a8c1a] !rounded-xl !px-8"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <HiCheck className="mr-2 h-4 w-4" />
                  Apply Crop
                </>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
