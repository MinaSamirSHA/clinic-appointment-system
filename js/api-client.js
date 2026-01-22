// API Client for Backend Communication
class APIClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    // Set authorization token
    setToken(token) {
        this.token = token;
        localStorage.setItem('accessToken', token);
    }

    // Set refresh token
    setRefreshToken(token) {
        this.refreshToken = token;
        localStorage.setItem('refreshToken', token);
    }

    // Clear tokens
    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    // Make HTTP request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authorization header if token exists
        if (this.token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            // Handle token expiration
            if (response.status === 401 && data.message === 'Token expired') {
                // Try to refresh token
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry original request
                    return this.request(endpoint, options);
                } else {
                    // Refresh failed, logout
                    this.clearTokens();
                    throw new Error('Session expired. Please login again.');
                }
            }

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) return false;

        try {
            const data = await this.request('/auth/refresh', {
                method: 'POST',
                body: JSON.stringify({ refreshToken: this.refreshToken }),
                skipAuth: true
            });

            if (data.success) {
                this.setToken(data.data.accessToken);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Authentication APIs
    async register(clinicData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(clinicData),
            skipAuth: true
        });

        if (data.success) {
            this.setToken(data.data.tokens.accessToken);
            this.setRefreshToken(data.data.tokens.refreshToken);
        }

        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true
        });

        if (data.success) {
            this.setToken(data.data.tokens.accessToken);
            this.setRefreshToken(data.data.tokens.refreshToken);
        }

        return data;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    logout() {
        this.clearTokens();
    }

    // Clinics APIs
    async getAllClinics() {
        return await this.request('/clinics', { skipAuth: true });
    }

    async getClinicById(id) {
        return await this.request(`/clinics/${id}`, { skipAuth: true });
    }

    async updateClinic(id, clinicData) {
        return await this.request(`/clinics/${id}`, {
            method: 'PUT',
            body: JSON.stringify(clinicData)
        });
    }

    // Appointments APIs
    async createAppointment(appointmentData) {
        return await this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
            skipAuth: true
        });
    }

    async getClinicAppointments(clinicId) {
        return await this.request(`/appointments/clinic/${clinicId}`);
    }

    async getAppointmentById(id) {
        return await this.request(`/appointments/${id}`);
    }

    async updateAppointmentStatus(id, status) {
        return await this.request(`/appointments/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }

    async deleteAppointment(id) {
        return await this.request(`/appointments/${id}`, {
            method: 'DELETE'
        });
    }
}

// Create global instance
const apiClient = new APIClient();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, apiClient };
}
