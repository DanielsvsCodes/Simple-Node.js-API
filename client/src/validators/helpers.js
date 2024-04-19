export function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

export async function checkEmailExists(email) {
    try {
        const response = await fetch(`http://localhost:5000/users/email/${email}`);
        if (!response.ok) {
            throw new Error('Failed to check email existence');
        }
        const data = await response.json();
        return !!data.exists;
    } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
    }
}
