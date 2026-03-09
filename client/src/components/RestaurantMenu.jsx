import { useState } from 'react'
import { Card, Accordion, Badge } from 'flowbite-react'
import { HiCurrencyDollar, HiChevronDown, HiChevronUp } from 'react-icons/hi'

export default function RestaurantMenu({ menu }) {
  const [expandedCategories, setExpandedCategories] = useState([0])

  if (!menu || menu.length === 0) {
    return (
      <Card className="mt-6">
        <div className="text-center py-8 text-gray-500">
          <p>No menu available for this restaurant.</p>
        </div>
      </Card>
    )
  }

  const toggleCategory = (index) => {
    if (expandedCategories.includes(index)) {
      setExpandedCategories(expandedCategories.filter((i) => i !== index))
    } else {
      setExpandedCategories([...expandedCategories, index])
    }
  }

  return (
    <Card className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Full Menu</h2>
      
      <div className="space-y-4">
        {menu.map((category, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleCategory(index)}
            >
              <span className="font-semibold text-lg">{category.category}</span>
              <span className="text-gray-500 text-sm">
                {category.items.length} items
              </span>
              {expandedCategories.includes(index) ? (
                <HiChevronUp className="w-5 h-5" />
              ) : (
                <HiChevronDown className="w-5 h-5" />
              )}
            </button>
            
            {expandedCategories.includes(index) && (
              <div className="divide-y">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="font-semibold text-[#8fa31e]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">
                        <span className="font-medium">Ingredients:</span> {item.ingredients.join(', ')}
                      </p>
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.allergens.map((allergen, i) => (
                            <Badge key={i} color="warning" size="xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
