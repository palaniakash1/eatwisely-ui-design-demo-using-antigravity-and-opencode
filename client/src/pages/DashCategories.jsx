import { useState } from "react";
import {
  Badge,
  Button,
  Modal,
  Checkbox,
  Spinner,
} from "flowbite-react";
import { FaTrash, FaPlus, FaList, FaEdit } from "react-icons/fa";
import {  HiTag, HiStatusOnline, HiStatusOffline, HiSearch } from "react-icons/hi";
import { TextInput } from "flowbite-react";
import { TbCategory2 } from 'react-icons/tb';


const defaultCategories = [
  { _id: "1", name: "Indian", slug: "indian", description: "Indian cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "2", name: "Chinese", slug: "chinese", description: "Chinese cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "3", name: "Italian", slug: "italian", description: "Italian cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "4", name: "Mexican", slug: "mexican", description: "Mexican cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "5", name: "Japanese", slug: "japanese", description: "Japanese cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "6", name: "Thai", slug: "thai", description: "Thai cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "7", name: "American", slug: "american", description: "American cuisine", isActive: true, createdAt: "2025-01-01" },
  { _id: "8", name: "Mediterranean", slug: "mediterranean", description: "Mediterranean cuisine", isActive: true, createdAt: "2025-01-01" },
];

function SwitchField({ checked, onChange, id }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[#8fa31e] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d8e89d] after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
    </label>
  );
}

const getInitialCategories = () => {
  try {
    const stored = localStorage.getItem("categories");
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load categories:', e);
  }
  localStorage.setItem("categories", JSON.stringify(defaultCategories));
  return defaultCategories;
};

export default function DashCategories() {
  const [categories] = useState(getInitialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
  });

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
      (statusFilter === "active" && category.isActive) ||
      (statusFilter === "inactive" && !category.isActive);
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredCategories.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
  };

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleAddCategory = () => {
    const newCategory = {
      _id: Date.now().toString(),
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
      createdAt: new Date().toISOString(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setShowAddModal(false);
    setFormData({ name: "", slug: "", description: "", isActive: true });
  };

  const handleEditCategory = () => {
    const updatedCategories = categories.map((c) =>
      c._id === selectedCategory._id ? { ...c, ...formData, slug: formData.slug || generateSlug(formData.name) } : c
    );
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id) => {
    const updatedCategories = categories.filter((c) => c._id !== id);
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
    });
    setShowEditModal(true);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 sm:px-8 py-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                    <TbCategory2  className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Categories</h1>
                    <p className="text-green-100 text-sm">Manage menu categories</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/95 text-[#6b7d18] rounded-xl transition-all font-semibold shadow-lg shadow-white/25"
                >
                  <FaPlus className="w-5 h-5" />
                  Add Category
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("")}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-xl flex items-center justify-center text-white shadow-lg">
                      <TbCategory2  className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{stats.total}</div>
                      <div className="text-xs text-gray-500 font-medium">Total</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("active")}>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <HiStatusOnline className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{stats.active}</div>
                      <div className="text-xs text-gray-500 font-medium">Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("inactive")}>
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <HiStatusOffline className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{stats.inactive}</div>
                      <div className="text-xs text-gray-500 font-medium">Inactive</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:flex-none lg:w-72">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa31e]" />
                    <TextInput
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 [&_input]:!bg-[#f7f9e8] [&_input]:!border-[#d4de8a] focus:[&_input]:!ring-[#8fa31e] focus:[&_input]:!border-[#8fa31e]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-800 text-lg">All Categories</h2>
                <span className="px-3 py-1 bg-[#8fa31e]/10 text-[#6b7d18] text-xs font-bold rounded-full border border-[#8fa31e]/20">
                  {totalItems} categories
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {paginatedCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="w-20 h-20 bg-[#f7f9e8] rounded-full flex items-center justify-center mb-5 border-2 border-[#d4de8a]/40">
                    <TbCategory2  className="w-10 h-10 text-[#8fa31e]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No categories found</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first category</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#8fa31e] to-[#a5b82e] text-white rounded-xl hover:shadow-xl hover:shadow-[#8fa31e]/20 transition-all font-semibold"
                  >
                    <FaPlus className="w-5 h-5 inline mr-2" />
                    Add Category
                  </button>
                </div>
              ) : (
                paginatedCategories.map((category) => (
                  <div key={category._id} className="px-6 sm:px-8 py-5 hover:bg-[#f7f9e8]/30 transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-xl flex items-center justify-center text-white shadow-lg">
                          <HiTag className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800 text-lg">{category.name}</span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <code className="text-xs text-gray-500 mt-1 block">{category.slug}</code>
                          <p className="text-sm text-gray-500 mt-2">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#8fa31e]/10 hover:bg-[#8fa31e]/20 text-[#6b7d18] rounded-xl transition-all font-semibold text-sm"
                        >
                          <FaEdit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-semibold text-sm"
                        >
                          <FaTrash className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalItems > itemsPerPage && (
              <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="xs" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                    <span className="text-sm font-medium">Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</span>
                    <Button size="xs" onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalItems / itemsPerPage), p + 1))} disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}>Next</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} popup size="md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Add New Category</h3>
            <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated if empty" className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 outline-none text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <Button color="gray" onClick={() => setShowAddModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAddCategory} className="!bg-gradient-to-r !from-[#6b7d18] !to-[#8fa31e] hover:!from-[#4a5c10] hover:!to-[#6b7d18] rounded-xl">Add Category</Button>
          </div>
        </div>
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} popup size="md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Edit Category</h3>
            <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 outline-none text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="editIsActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <Button color="gray" onClick={() => setShowEditModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleEditCategory} className="!bg-gradient-to-r !from-[#6b7d18] !to-[#8fa31e] hover:!from-[#4a5c10] hover:!to-[#6b7d18] rounded-xl">Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
