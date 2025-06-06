import axios from 'axios';

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

async function getApiInstance() {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
        guestId = await generateGuestId();
    }

    return axios.create({
        baseURL: '/api',
        headers: {
            'X-Guest-UUID': guestId,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
}
export let api = await getApiInstance();