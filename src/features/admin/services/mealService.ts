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

    // Xoa mem mon an
    delete: (id: number) =>
        api(`/api/meals/${id}`, {
            method: 'DELETE',
        }),
}