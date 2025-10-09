"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Save, DollarSign, Tag, Text, Layers } from "lucide-react";

// Expense Category Enum equivalent
const ExpenseCategories = [
  "INVENTORY",
  "LOGISTICS",
  "MARKETING",
  "SALARY",
  "OTHER",
];

// Form data interface
interface ExpenseFormData {
  title: string;
  description: string;
  category: string;
  amount: number;
}

interface ExpenseFormModalProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    category: string;
    amount: number;
  } | null;
  onClose: () => void;
}

/**
 * Reusable modal for creating or updating an expense using React Hook Form.
 */
const ExpenseFormModal = ({ initialData, onClose }: ExpenseFormModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<ExpenseFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: ExpenseCategories[0],
      amount: 0,
    },
    mode: "onBlur",
  });

  const isEditing = initialData && initialData.id;
  const modalTitle = isEditing
    ? `Edit Expense: ${initialData.title}`
    : "Create New Expense";

  // Effect to populate form when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || ExpenseCategories[0],
        amount: initialData.amount || 0,
      });
    } else if (!isEditing) {
      reset({
        title: "",
        description: "",
        category: ExpenseCategories[0],
        amount: 0,
      });
    }
  }, [initialData, isEditing, reset]);

  const handleFormSubmit = (data: ExpenseFormData) => {
    const dataToSubmit = isEditing ? { id: initialData.id, ...data } : data;
    console.log(dataToSubmit);
  };

  // --- Form Field Helper Component ---
  const FormField = ({
    id,
    label,
    icon: Icon,
    error,
    children,
  }: {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className: string }>;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col space-y-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 flex items-center"
      >
        {Icon && <Icon className="w-4 h-4 mr-2 text-indigo-500" />}
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-400/50 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4 transform transition-all scale-100 duration-300">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <FormField
              id="title"
              label="Title"
              icon={Tag}
              error={errors.title?.message}
            >
              <input
                id="title"
                type="text"
                placeholder="Enter expense title"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 2,
                    message: "Title must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must not exceed 100 characters",
                  },
                })}
              />
            </FormField>

            {/* Category Select */}
            <FormField
              id="category"
              label="Category"
              icon={Layers}
              error={errors.category?.message}
            >
              <select
                id="category"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                {...register("category", {
                  required: "Category is required",
                })}
              >
                {ExpenseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Amount */}
          <FormField
            id="amount"
            label="Amount (₹)"
            icon={DollarSign}
            error={errors.amount?.message}
          >
            <input
              id="amount"
              type="text"
              placeholder="1000"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 transition ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
              {...register("amount", {
                required: "Amount is required",
                validate: (value) => {
                  const num = parseFloat(value as any);
                  if (isNaN(num) || num <= 0) {
                    return "Amount must be a positive number";
                  }
                  return true;
                },
              })}
            />
          </FormField>

          {/* Description */}
          <FormField
            id="description"
            label="Description"
            icon={Text}
            error={errors.description?.message}
          >
            <textarea
              id="description"
              rows={3}
              placeholder="Enter expense description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-indigo-500 resize-none transition focus:border-indigo-500"
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description must not exceed 500 characters",
                },
              })}
            />
          </FormField>

          {/* Modal Footer (Submit Button) */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg transition duration-150"
            >
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? "Update Expense" : "Create Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormModal;
