import axios from 'axios';

let apiInstance = null;

async function generateGuestId() {
    try {
        const response = await axios.get('/api/register-guest');
        const uuid = response.data.data.guest_uuid;
        localStorage.setItem('guestId', uuid);
        console.log('Generated Guest ID:', uuid);
        return uuid;
    } catch (error) {
        console.error('Error generating guest ID:', error);
        return null;
    }
}

export async function getApiInstance() {
    if (apiInstance) return apiInstance;
    let guestId = localStorage.getItem('guestId');
    console.log('Retrieved Guest ID from localStorage:', guestId);
    if (!guestId) {
        guestId = await generateGuestId();
    }

    apiInstance = axios.create({
        baseURL: '/api',
        headers: {
            'X-Guest-UUID': guestId,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    return apiInstance;
}

export function clearApiInstance() {
    localStorage.clear();
    apiInstance = null; // Clear the singleton instance
}
