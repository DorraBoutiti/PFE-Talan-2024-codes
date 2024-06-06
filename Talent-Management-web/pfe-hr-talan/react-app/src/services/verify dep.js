import React, { useEffect, useState } from 'react';
import { getUserProfile } from './authentification.service';
import { useNavigate } from 'react-router-dom';


const withAuthorization = (WrappedComponent, requiredDep) => {
  return (props) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch user profile to check department
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.dep !== 'RH') {
                    alert('You are not authorized to access this content.');
                    navigate('/dep/dep-unauthorized');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('Error fetching user profile.');
                navigate('/dep/dep-unauthorized');
            }
        };

        if (token) {
            fetchUserProfile();
        } else {
            alert('You are not authorized to access this content.');
            navigate('/dep/dep-unauthorized');
        }
    }, [navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthorized) {
      return <div>You are not authorized to access this content.</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
