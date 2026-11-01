import { api } from '@/shared/services/httpClient'
import type { AdminMeal, MealRequest } from '../models/AdminMeal'

export const mealService = {
    // Lay tat ca mon an
    getAll: () =>
        api<AdminMeal[]>('/api/meals/manage'),

    // Them mon an
    create: (data: MealRequest) =>
        api<AdminMeal>('/api/meals', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Sua mon an
    update: (id: number, data: MealRequest) =>
        api<AdminMeal>(`/api/meals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    // An hoac hien mon an
    updateAvailability: (id: number, isAvailable: boolean) =>
        api(`/api/meals/${id}/availability?isAvailable=${isAvailable}`, {
            method: 'PATCH',
        }),

    // Xep thuc don cho mot ngay
    updateDailyMenu: (date: string, mealIds: number[]) =>
        api<{ message: string }>(`/api/meals/daily/${date}`, {
            method: 'PUT',
            body: JSON.stringify({ mealIds }),
        }),

    // Xoa mem mon an
    delete: (id: number) =>
        api(`/api/meals/${id}`, {
            method: 'DELETE',
        }),
}