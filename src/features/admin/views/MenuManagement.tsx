
import { useEffect, useMemo, useState } from 'react'
import type { AdminMeal, MealRequest } from '../models/AdminMeal'
import { mealService } from '../services/mealService'
import { errorMessage } from '@/shared/services/httpClient'
import { formatNutrition } from '@/features/catalog/data/labels'

const emptyForm: MealRequest = {
    name: '',
    description: '',
    mealType: 'Lunch',
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    price: 0,
    imageUrl: '',
    servingSize: '',
    allergens: '',
    goal: 'EatClean',
    isAvailable: true,
}

export default function MenuManagement() {
    const [meals, setMeals] = useState<AdminMeal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editingMeal, setEditingMeal] = useState<AdminMeal | null>(null)
    const [form, setForm] = useState<MealRequest>(emptyForm)
    const [saving, setSaving] = useState(false)

    const loadMeals = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await mealService.getAll()
            setMeals(data)
        } catch (err) {
            setError(errorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMeals()
    }, [])

    const filteredMeals = useMemo(() => {
        return meals.filter(meal =>
            meal.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [meals, search])

    const openCreateForm = () => {
        setEditingMeal(null)
        setForm(emptyForm)
        setShowForm(true)
    }

    const openEditForm = (meal: AdminMeal) => {
        setEditingMeal(meal)
        setForm({
            name: meal.name,
            description: meal.description ?? '',
            mealType: meal.mealType,
            calories: meal.calories,
            proteinG: meal.proteinG,
            carbsG: meal.carbsG,
            fatG: meal.fatG,
            price: meal.price,
            imageUrl: meal.imageUrl ?? '',
            servingSize: meal.servingSize ?? '',
            allergens: meal.allergens ?? '',
            goal: meal.goal ?? '',
            isAvailable: meal.isAvailable,
        })
        setShowForm(true)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target

        setForm(previous => ({
            ...previous,
            [name]: type !== 'number' ? value : value === '' ? null : Number(value),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setSaving(true)
            setError('')

            if (editingMeal) {
                await mealService.update(editingMeal.mealId, form)
            } else {
                await mealService.create(form)
            }

            setShowForm(false)
            setEditingMeal(null)
            setForm(emptyForm)
            await loadMeals()
        } catch (err) {
            setError(errorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleAvailability = async (meal: AdminMeal) => {
        try {
            setError('')
            await mealService.updateAvailability(
                meal.mealId,
                !meal.isAvailable
            )
            await loadMeals()
        } catch (err) {
            setError(errorMessage(err))
        }
    }

    const handleDelete = async (meal: AdminMeal) => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn ẩn món "${meal.name}" khỏi thực đơn không?`
        )

        if (!confirmed) return

        try {
            setError('')
            await mealService.delete(meal.mealId)
            await loadMeals()
        } catch (err) {
            setError(errorMessage(err))
        }
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN').format(price) + ' đ'

    if (loading) {
        return <div className="p-6 text-gray-500" > Đang tải thực đơn...</div>
    }

    return (
        <div className= "space-y-6 p-6" >
        {/* Header */ }
        < div className = "flex flex-col justify-between gap-4 sm:flex-row sm:items-center" >
            <div>
            <h1 className="text-2xl font-bold text-gray-800" >
                Quản lý thực đơn
                    </h1>
                    < p className = "mt-1 text-sm text-gray-500" >
                        Thêm, chỉnh sửa và quản lý các món ăn của OffiMeal.
          </p>
                            </div>

                            < button
    onClick = { openCreateForm }
    className = "rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
        >
        + Thêm món ăn
            </button>
            </div>

    {/* Error */ }
    {
        error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600" >
            { error }
                </div>
      )
    }

    {/* Search */ }
    <div className="rounded-xl border bg-white p-4" >
        <input
          type="text"
    value = { search }
    onChange = { e => setSearch(e.target.value) }
    placeholder = "Tìm kiếm món ăn..."
    className = "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500"
        />
        </div>

    {/* Meal list */ }
    <div className="overflow-hidden rounded-xl border bg-white" >
        <div className="overflow-x-auto" >
            <table className="w-full text-left text-sm" >
                <thead className="bg-gray-50 text-gray-600" >
                    <tr>
                    <th className="px-5 py-4" > Món ăn </th>
                        < th className = "px-5 py-4" > Loại </th>
                            < th className = "px-5 py-4" > Calories </th>
                                < th className = "px-5 py-4" > Giá </th>
                                    < th className = "px-5 py-4" > Trạng thái </th>
                                        < th className = "px-5 py-4 text-center" > Thao tác </th>
                                            </tr>
                                            </thead>

                                            < tbody className = "divide-y" >
                                                {
                                                    filteredMeals.map(meal => (
                                                        <tr key= { meal.mealId } className = "hover:bg-gray-50" >
                                                        <td className="px-5 py-4" >
                                                    <div className="flex items-center gap-3" >
                                                    {
                                                        meal.imageUrl ? (
                                                            <img
                          src= { meal.imageUrl }
                          alt={ meal.name }
                          className="h-12 w-12 rounded-lg object-cover"
                                                        />
                      ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400" >
                                                        No image
                                                        </div>
                                                        )
}

<div>
    <p className="font-medium text-gray-800" >
    { meal.name }
        </p>
        < p className = "text-xs text-gray-500" >
        { meal.goal || 'Chưa phân loại' }
            </p>
            </div>
            </div>
            </td>

            < td className = "px-5 py-4" > { meal.mealType } </td>

                < td className = "px-5 py-4" >
                { formatNutrition(meal.calories, 'kcal') }
                    </td>

                    < td className = "px-5 py-4 font-medium" >
                    { formatPrice(meal.price) }
                        </td>

                        < td className = "px-5 py-4" >
                            <span
                      className={
    `rounded-full px-3 py-1 text-xs font-medium ${meal.isAvailable
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-600'
    }`
}
                    >
{ meal.isAvailable ? 'Đang bán' : 'Đã ẩn' }
    </span>
    </td>

    < td className = "px-5 py-4" >
        <div className="flex justify-center gap-2" >
            <button
                        onClick={ () => openEditForm(meal) }
className = "rounded-md border px-3 py-1.5 text-blue-600 hover:bg-blue-50"
    >
    Sửa
    </button>

    < button
onClick = {() => handleAvailability(meal)}
className = "rounded-md border px-3 py-1.5 text-gray-600 hover:bg-gray-100"
    >
{ meal.isAvailable ? 'Ẩn' : 'Hiện' }
    </button>

    < button
onClick = {() => handleDelete(meal)}
className = "rounded-md border px-3 py-1.5 text-red-600 hover:bg-red-50"
    >
    Xóa
    </button>
    </div>
    </td>
    </tr>
              ))}

{
    filteredMeals.length === 0 && (
        <tr>
        <td
                    colSpan={ 6 }
    className = "px-5 py-10 text-center text-gray-500"
        >
        Không tìm thấy món ăn nào.
                  </td>
            </tr>
              )
}
</tbody>
    </table>
    </div>

    < div className = "border-t px-5 py-3 text-sm text-gray-500" >
        Tổng số món ăn: { filteredMeals.length }
</div>
    </div>

{/* Create / Edit form */ }
{
    showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6" >
                <div className="mb-5 flex items-center justify-between" >
                    <h2 className="text-xl font-bold text-gray-800" >
                    { editingMeal? 'Chỉnh sửa món ăn': 'Thêm món ăn mới' }
                        </h2>

                        < button
    onClick = {() => setShowForm(false)
}
className = "text-2xl text-gray-400 hover:text-gray-700"
    >
                ×
</button>
    </div>

    < form onSubmit = { handleSubmit } className = "space-y-4" >
        <div>
        <label className="mb-1 block text-sm font-medium" >
            Tên món ăn *
                </label>
                < input
required
name = "name"
value = { form.name }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Mô tả
            </label>
            < textarea
name = "description"
value = { form.description }
onChange = { handleChange }
rows = { 3}
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div className = "grid grid-cols-1 gap-4 sm:grid-cols-2" >
        <div>
        <label className="mb-1 block text-sm font-medium" >
            Loại món ăn
                </label>
                < select
name = "mealType"
value = { form.mealType }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    >
    <option value="Breakfast" > Breakfast </option>
        < option value = "Lunch" > Lunch </option>
            < option value = "Dinner" > Dinner </option>
                < option value = "Snack" > Snack </option>
                    </select>
                    </div>

                    < div >
                    <label className="mb-1 block text-sm font-medium" >
                        Chế độ ăn
                            </label>
                            < select
name = "goal"
value = { form.goal }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    >
    <option value="EatClean" > EatClean </option>
        < option value = "Keto" > Keto </option>
            < option value = "LowCarb" > LowCarb </option>
                < option value = "Balanced" > Balanced </option>
                < option value = "Vegetarian" > Vegetarian </option>
                    </select>
                    </div>

                    < div >
                    <label className="mb-1 block text-sm font-medium" >
                        Calories(kcal)
                        </label>
                        < input
type = "number"
min = "0"
name = "calories"
value = { form.calories ?? '' }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Protein(g)
        </label>
        < input
type = "number"
min = "0"
name = "proteinG"
value = { form.proteinG ?? '' }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Carbs(g)
        </label>
        < input
type = "number"
min = "0"
name = "carbsG"
value = { form.carbsG ?? '' }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Fat(g)
        </label>
        < input
type = "number"
min = "0"
name = "fatG"
value = { form.fatG ?? '' }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Giá(VND)
        </label>
        < input
type = "number"
min = "0"
name = "price"
value = { form.price }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Khẩu phần
            </label>
            < input
name = "servingSize"
value = { form.servingSize }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
placeholder = "Ví dụ: 350g"
    />
    </div>
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Dị ứng / Thành phần cần lưu ý
            </label>
            < input
name = "allergens"
value = { form.allergens }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
placeholder = "Ví dụ: Đậu phộng, sữa..."
    />
    </div>

    < div >
    <label className="mb-1 block text-sm font-medium" >
        Đường dẫn hình ảnh
            </label>
            < input
name = "imageUrl"
value = { form.imageUrl }
onChange = { handleChange }
className = "w-full rounded-lg border px-3 py-2"
placeholder = "/images/meals/example.jpg"
    />
    </div>

    < label className = "flex items-center gap-2 text-sm" >
        <input
                  type="checkbox"
checked = { form.isAvailable }
onChange = {
    e =>
    setForm(previous => ({
        ...previous,
        isAvailable: e.target.checked,
    }))
                  }
                />
                Hiển thị món ăn trên thực đơn
    </label>

    < div className = "flex justify-end gap-3 border-t pt-4" >
        <button
                  type="button"
onClick = {() => setShowForm(false)}
className = "rounded-lg border px-5 py-2 hover:bg-gray-50"
    >
    Hủy
    </button>

    < button
type = "submit"
disabled = { saving }
className = "rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
    >
{
    saving
    ? 'Đang lưu...'
        : editingMeal
            ? 'Lưu thay đổi'
            : 'Thêm món ăn'
}
    </button>
    </div>
    </form>
    </div>
    </div>
      )}
</div>
  )
}
