import Cookies from 'js-cookie';
export const complaintFormSubmit = (title, category, description, setUpdate) => {
    const userId = Cookies.get('userId');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8800/complaints/user/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get('token')}` },
                body: JSON.stringify({ userId, title, category, description }),
            });
            if (response.ok) {
                alert('Complaint submitted successfully!');
                e.target.reset();
                setUpdate((prev) => (prev === 0 ? 1 : 0));
            } else {
                const data = await response.json();
                alert(`Failed to submit complaint: ${data.message}`);
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
        }
    };

    return handleSubmit;
}