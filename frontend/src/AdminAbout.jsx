import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import './AdminAbout.css';

const API = 'http://localhost:5098/api';

export default function AdminAbout() {
    const resolveUrl = (url) => {
        if (!url || url === 'string' || url === '') return '/assets/employee.png';
        if (url.startsWith('/uploads/')) return `http://localhost:5098${url}`;
        if (url.startsWith('/assets/')) return url;
        return url;
    };
    const [employees, setEmployees] = useState([]);
    const [references, setReferences] = useState([]);
    const [director, setDirector] = useState(null);
    const [originalDirector, setOriginalDirector] = useState(null);
    const [originalEmployees, setOriginalEmployees] = useState([]);

    // Add state for main content (Slide 1) - now fetched from API
    const [mainContent, setMainContent] = useState({
        heading: '',
        headingEn: '',
        headingRu: '',
        subtext: '',
        subtextEn: '',
        subtextRu: '',
        imageUrl: ''
    });
    const [originalMainContent, setOriginalMainContent] = useState({
        heading: '',
        headingEn: '',
        headingRu: '',
        subtext: '',
        subtextEn: '',
        subtextRu: '',
        imageUrl: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'employee' or 'reference'
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        nameEn: '',
        nameRu: '',
        position: '',
        phone: '',
        email: '',
        linkedin: '',
        description: '',
        imageUrl: ''
    });
    const [newReference, setNewReference] = useState({ name: '', images: [], alt: '' });

    // Create a persistent file input ref
    const fileInputRef = useRef(null);

    const loadEmployees = async () => {
        try {
            const res = await fetch(`${API}/employees?raw=true`);
            if (res.ok) {
                const allEmployees = await res.json();

                // Map API response to frontend format (linkedIn -> linkedin)
                const mappedEmployees = allEmployees.map(emp => ({
                    ...emp,
                    linkedin: emp.linkedIn
                }));

                // Find director and separate from other employees
                const directorEmployee = mappedEmployees.find(emp =>
                    emp.position.toLowerCase().includes('direktor') ||
                    emp.position.toLowerCase().includes('director')
                );
                setDirector(directorEmployee);
                setOriginalDirector(directorEmployee);

                // Filter out director from employees list
                const otherEmployees = mappedEmployees.filter(emp => emp.id !== directorEmployee?.id);
                setEmployees(otherEmployees);
                setOriginalEmployees(otherEmployees);
            }
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    };

    const loadReferences = async () => {
        try {
            const res = await fetch(`${API}/references`);
            if (res.ok) setReferences(await res.json());
        } catch (error) {
            console.error('Error loading references:', error);
        }
    };

    const loadAboutLogo = async () => {
        try {
            const res = await fetch(`${API}/AboutLogo?raw=true`);
            if (res.ok) {
                const aboutLogos = await res.json();
                if (aboutLogos.length > 0) {
                    const aboutLogo = aboutLogos[0];
                    setMainContent({
                        heading: aboutLogo.heading || '',
                        headingEn: aboutLogo.headingEn || '',
                        headingRu: aboutLogo.headingRu || '',
                        subtext: aboutLogo.subtext || '',
                        subtextEn: aboutLogo.subtextEn || '',
                        subtextRu: aboutLogo.subtextRu || '',
                        imageUrl: aboutLogo.imageUrl || ''
                    });
                    setOriginalMainContent({
                        heading: aboutLogo.heading || '',
                        headingEn: aboutLogo.headingEn || '',
                        headingRu: aboutLogo.headingRu || '',
                        subtext: aboutLogo.subtext || '',
                        subtextEn: aboutLogo.subtextEn || '',
                        subtextRu: aboutLogo.subtextRu || '',
                        imageUrl: aboutLogo.imageUrl || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error loading about logo:', error);
        }
    };

    useEffect(() => {
        loadEmployees();
        loadReferences();
        loadAboutLogo();
    }, []);

    const removeEmployee = async (id) => {
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: 'Bu işçi silinəcək!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Bəli, sil!',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API}/employees/${id}`, { method: 'DELETE' });
                if (res.status === 204) {
                    await loadEmployees();
                    Swal.fire(
                        'Silindi!',
                        'İşçi uğurla silindi.',
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error removing employee:', error);
                Swal.fire(
                    'Xəta!',
                    'İşçi silinərkən xəta baş verdi',
                    'error'
                );
            }
        }
    };

    const removeReference = async (id) => {
        const result = await Swal.fire({
            title: 'Əminsiniz?',
            text: 'Bu referans silinəcək!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Bəli, sil!',
            cancelButtonText: 'Ləğv et'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API}/references/${id}`, { method: 'DELETE' });
                if (res.status === 204) {
                    await loadReferences();
                    Swal.fire(
                        'Silindi!',
                        'Referans uğurla silindi.',
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error removing reference:', error);
                Swal.fire(
                    'Xəta!',
                    'Referans silinərkən xəta baş verdi',
                    'error'
                );
            }
        }
    };

    const updateDirector = async (updatedData) => {
        if (!director) return;

        // Validate required fields
        if (!updatedData.name || !updatedData.name.trim()) {
            Swal.fire(
                'Xəta!',
                'Direktor adı məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.position || !updatedData.position.trim()) {
            Swal.fire(
                'Xəta!',
                'Direktor vəzifəsi məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.phone || !updatedData.phone.trim()) {
            Swal.fire(
                'Xəta!',
                'Telefon nömrəsi məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.email || !updatedData.email.trim()) {
            Swal.fire(
                'Xəta!',
                'Email ünvanı məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.linkedin || !updatedData.linkedin.trim()) {
            Swal.fire(
                'Xəta!',
                'LinkedIn linki məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.imageUrl) {
            Swal.fire(
                'Xəta!',
                'Şəkil məcburidir',
                'error'
            );
            return;
        }

        try {
            const res = await fetch(`${API}/employees/${director.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedData.name,
                    position: updatedData.position,
                    positionEn: updatedData.positionEn || null,
                    positionRu: updatedData.positionRu || null,
                    description: updatedData.description || null,
                    descriptionEn: updatedData.descriptionEn || null,
                    descriptionRu: updatedData.descriptionRu || null,
                    phone: updatedData.phone,
                    email: updatedData.email,
                    linkedIn: updatedData.linkedin,
                    imageUrl: updatedData.imageUrl
                })
            });
            if (res.ok) {
                const updatedDirector = await res.json();

                // Update the local state immediately instead of reloading
                // Map API response to frontend format
                const mappedDirector = {
                    ...updatedDirector,
                    linkedin: updatedDirector.linkedIn // Map linkedIn to linkedin
                };
                setDirector(mappedDirector);
                setOriginalDirector(mappedDirector);
            } else {
                const errorText = await res.text();
                console.error('Director update failed:', errorText);
                throw new Error('Director update failed');
            }
        } catch (error) {
            console.error('Error updating director:', error);
            Swal.fire(
                'Xəta!',
                'Direktor məlumatları yenilənərkən xəta baş verdi',
                'error'
            );
        }
    };

    const updateEmployee = async (id, updatedData) => {
        // Validate required fields
        if (!updatedData.name || !updatedData.name.trim()) {
            Swal.fire(
                'Xəta!',
                'İşçi adı məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.position || !updatedData.position.trim()) {
            Swal.fire(
                'Xəta!',
                'İşçi vəzifəsi məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.phone || !updatedData.phone.trim()) {
            Swal.fire(
                'Xəta!',
                'Telefon nömrəsi məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.email || !updatedData.email.trim()) {
            Swal.fire(
                'Xəta!',
                'Email ünvanı məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.linkedin || !updatedData.linkedin.trim()) {
            Swal.fire(
                'Xəta!',
                'LinkedIn linki məcburidir',
                'error'
            );
            return;
        }

        if (!updatedData.imageUrl) {
            Swal.fire(
                'Xəta!',
                'Şəkil məcburidir',
                'error'
            );
            return;
        }

        try {
            const res = await fetch(`${API}/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updatedEmployee = await res.json();

                // Update the local state immediately instead of reloading
                // Map API response to frontend format
                const mappedEmployee = {
                    ...updatedEmployee,
                    linkedin: updatedEmployee.linkedIn // Map linkedIn to linkedin
                };
                setEmployees(prev => prev.map(emp =>
                    emp.id === id ? mappedEmployee : emp
                ));
                setOriginalEmployees(prev => prev.map(emp =>
                    emp.id === id ? mappedEmployee : emp
                ));
            } else {
                const errorText = await res.text();
                console.error('Update failed:', errorText);
                throw new Error('Employee update failed');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            Swal.fire(
                'Xəta!',
                'İşçi məlumatları yenilənərkən xəta baş verdi',
                'error'
            );
        }
    };

    const handleAddEmployee = () => {
        setModalType('employee');
        setShowModal(true);
    };

    const handleAddReference = () => {
        setModalType('reference');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType('');
        setNewEmployee({
            name: '',
            nameEn: '',
            nameRu: '',
            position: '',
            phone: '',
            email: '',
            linkedin: '',
            description: '',
            imageUrl: ''
        });
        setNewReference({ name: '', images: [], alt: '' });

        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (modalType === 'employee') {
            // Validate required fields for employee
            if (!newEmployee.name || !newEmployee.name.trim()) {
                Swal.fire(
                    'Xəta!',
                    'İşçi adı məcburidir',
                    'error'
                );
                return;
            }

            if (!newEmployee.position || !newEmployee.position.trim()) {
                Swal.fire(
                    'Xəta!',
                    'İşçi vəzifəsi məcburidir',
                    'error'
                );
                return;
            }

            if (!newEmployee.phone || !newEmployee.phone.trim()) {
                Swal.fire(
                    'Xəta!',
                    'Telefon nömrəsi məcburidir',
                    'error'
                );
                return;
            }

            if (!newEmployee.email || !newEmployee.email.trim()) {
                Swal.fire(
                    'Xəta!',
                    'Email ünvanı məcburidir',
                    'error'
                );
                return;
            }

            if (!newEmployee.linkedin || !newEmployee.linkedin.trim()) {
                Swal.fire(
                    'Xəta!',
                    'LinkedIn linki məcburidir',
                    'error'
                );
                return;
            }

            if (!newEmployee.imageUrl) {
                Swal.fire(
                    'Xəta!',
                    'Şəkil məcburidir',
                    'error'
                );
                return;
            }

            try {
                const res = await fetch(`${API}/employees`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEmployee)
                });
                if (!res.ok) throw new Error('Employee save failed');
                await loadEmployees();
                handleCloseModal();
                Swal.fire(
                    'Uğurlu!',
                    'İşçi uğurla əlavə edildi',
                    'success'
                );
            } catch (e) {
                Swal.fire(
                    'Xəta!',
                    'İşçi əlavə edilərkən xəta baş verdi',
                    'error'
                );
            }
        } else {
            // Validate required fields for reference
            if (!newReference.name || !newReference.name.trim()) {
                Swal.fire(
                    'Xəta!',
                    'Referans adı məcburidir',
                    'error'
                );
                return;
            }

            if (!newReference.images || newReference.images.length === 0) {
                Swal.fire(
                    'Xəta!',
                    'Ən azı bir şəkil məcburidir',
                    'error'
                );
                return;
            }

            try {
                // Create FormData to send files properly
                const formData = new FormData();
                formData.append('name', newReference.name);
                formData.append('alt', newReference.alt || '');

                // Add the first image file
                if (newReference.images[0] && newReference.images[0].file) {
                    formData.append('imageFile', newReference.images[0].file);
                }

                const res = await fetch(`${API}/references`, {
                    method: 'POST',
                    body: formData // Send FormData instead of JSON
                });
                if (!res.ok) throw new Error('Reference save failed');
                await loadReferences();
                handleCloseModal();
                Swal.fire(
                    'Uğurlu!',
                    'Referans uğurla əlavə edildi',
                    'success'
                );
            } catch (e) {
                console.error('Reference save error:', e);
                Swal.fire(
                    'Xəta!',
                    'Referans əlavə edilərkən xəta baş verdi',
                    'error'
                );
            }
        }
    };

    const handleDirectorChange = (field, value) => {
        if (director) {
            const updatedDirector = { ...director, [field]: value };
            setDirector(updatedDirector);
        }
    };

    const handleEmployeeChange = (id, field, value) => {
        const updatedEmployees = employees.map(emp =>
            emp.id === id ? { ...emp, [field]: value } : emp
        );
        setEmployees(updatedEmployees);
    };

    const handleDirectorSave = async () => {
        if (director) {
            try {
                await updateDirector(director);
                Swal.fire(
                    'Uğurlu!',
                    'Direktor məlumatları uğurla yadda saxlanıldı',
                    'success'
                );
            } catch (error) {
                // Error is already handled in updateDirector function
            }
        }
    };

    const handleDirectorUndo = () => {
        if (originalDirector) {
            setDirector(originalDirector);
        }
    };

    const handleEmployeeSave = async (id) => {
        const employee = employees.find(emp => emp.id === id);

        if (employee) {
            try {
                await updateEmployee(id, employee);
                Swal.fire(
                    'Uğurlu!',
                    'İşçi məlumatları uğurla yadda saxlanıldı',
                    'success'
                );
            } catch (error) {
                // Error is already handled in updateEmployee function
            }
        }
    };

    const handleEmployeeUndo = (id) => {
        const originalEmployee = originalEmployees.find(emp => emp.id === id);
        if (originalEmployee) {
            const updatedEmployees = employees.map(emp =>
                emp.id === id ? originalEmployee : emp
            );
            setEmployees(updatedEmployees);
        }
    };

    const hasDirectorChanges = () => {
        if (!director || !originalDirector) return false;
        return JSON.stringify(director) !== JSON.stringify(originalDirector);
    };

    const hasEmployeeChanges = (id) => {
        const employee = employees.find(emp => emp.id === id);
        const originalEmployee = originalEmployees.find(emp => emp.id === id);
        if (!employee || !originalEmployee) return false;
        return JSON.stringify(employee) !== JSON.stringify(originalEmployee);
    };

    // Add change tracking and save/undo functions for main content
    const hasMainContentChanges = () => {
        return JSON.stringify(mainContent) !== JSON.stringify(originalMainContent);
    };

    const handleMainContentChange = (field, value) => {
        setMainContent(prev => ({ ...prev, [field]: value }));
    };

    const handleMainContentSave = async () => {
        // Validate required fields
        if (!mainContent.heading || !mainContent.heading.trim()) {
            Swal.fire(
                'Xəta!',
                'Başlıq məcburidir',
                'error'
            );
            return;
        }

        if (!mainContent.subtext || !mainContent.subtext.trim()) {
            Swal.fire(
                'Xəta!',
                'Alt mətn məcburidir',
                'error'
            );
            return;
        }

        try {
            // Since we only have one AboutLogo record, we'll update it
            const res = await fetch(`${API}/AboutLogo/1`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: 1,
                    heading: mainContent.heading,
                    headingEn: mainContent.headingEn,
                    headingRu: mainContent.headingRu,
                    subtext: mainContent.subtext,
                    subtextEn: mainContent.subtextEn,
                    subtextRu: mainContent.subtextRu,
                    imageUrl: mainContent.imageUrl
                })
            });

            if (res.ok) {
                setOriginalMainContent(mainContent);
                Swal.fire(
                    'Uğurlu!',
                    'Məlumatlar uğurla yadda saxlanıldı',
                    'success'
                );
            } else {
                throw new Error('Failed to save main content');
            }
        } catch (error) {
            console.error('Error saving main content:', error);
            Swal.fire(
                'Xəta!',
                'Məlumatları yadda saxlayarkən xəta baş verdi',
                'error'
            );
        }
    };

    const handleMainContentUndo = () => {
        setMainContent(originalMainContent);
    };

    const handleBrowseImage = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Upload the image to the server
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(`${API}/upload/image`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                        // Convert full URL to relative path if needed
                        if (imageUrl.startsWith('http://localhost:5098')) {
                            imageUrl = imageUrl.replace('http://localhost:5098', '');
                        }
                        handleMainContentChange('imageUrl', imageUrl);
                    } else {
                        // Fallback to blob URL if upload fails
                        const imageUrl = URL.createObjectURL(file);
                        handleMainContentChange('imageUrl', imageUrl);
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    // Fallback to blob URL if upload fails
                    const imageUrl = URL.createObjectURL(file);
                    handleMainContentChange('imageUrl', imageUrl);
                }
            }
        };
        input.click();
    };

    const handleDeleteImage = () => {
        handleMainContentChange('imageUrl', '');
    };

    const handleDirectorImageDelete = () => {
        if (director) {
            const updatedDirector = { ...director, imageUrl: '' };
            setDirector(updatedDirector);
        }
    };

    const handleDirectorImageBrowse = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file && director) {
                try {
                    // Upload the image to the server
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(`${API}/upload/image`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                        // Convert full URL to relative path if needed
                        if (imageUrl.startsWith('http://localhost:5098')) {
                            imageUrl = imageUrl.replace('http://localhost:5098', '');
                        }
                        const updatedDirector = { ...director, imageUrl };
                        setDirector(updatedDirector);
                    } else {
                        // Fallback to blob URL if upload fails
                        const imageUrl = URL.createObjectURL(file);
                        const updatedDirector = { ...director, imageUrl };
                        setDirector(updatedDirector);
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    // Fallback to blob URL if upload fails
                    const imageUrl = URL.createObjectURL(file);
                    const updatedDirector = { ...director, imageUrl };
                    setDirector(updatedDirector);
                }
            }
        };
        input.click();
    };

    const handleEmployeeImageDelete = (employeeId) => {
        const updatedEmployees = employees.map(emp =>
            emp.id === employeeId ? { ...emp, imageUrl: '' } : emp
        );
        setEmployees(updatedEmployees);
    };

    const handleEmployeeImageBrowse = async (employeeId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Upload the image to the server
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(`${API}/upload/image`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                        // Convert full URL to relative path if needed
                        if (imageUrl.startsWith('http://localhost:5098')) {
                            imageUrl = imageUrl.replace('http://localhost:5098', '');
                        }
                        const updatedEmployees = employees.map(emp =>
                            emp.id === employeeId ? { ...emp, imageUrl } : emp
                        );
                        setEmployees(updatedEmployees);
                    } else {
                        // Fallback to blob URL if upload fails
                        const imageUrl = URL.createObjectURL(file);
                        const updatedEmployees = employees.map(emp =>
                            emp.id === employeeId ? { ...emp, imageUrl } : emp
                        );
                        setEmployees(updatedEmployees);
                    }
                } catch (error) {
                    console.error('Error uploading employee image:', error);
                    // Fallback to blob URL if upload fails
                    const imageUrl = URL.createObjectURL(file);
                    const updatedEmployees = employees.map(emp =>
                        emp.id === employeeId ? { ...emp, imageUrl } : emp
                    );
                    setEmployees(updatedEmployees);
                }
            }
        };
        input.click();
    };

    const handleBrowseReferenceImage = () => {
        // Use the persistent file input ref
        if (!fileInputRef.current) {
            // Create the file input if it doesn't exist
            fileInputRef.current = document.createElement('input');
            fileInputRef.current.type = 'file';
            fileInputRef.current.accept = 'image/*';
            fileInputRef.current.multiple = true;
            fileInputRef.current.setAttribute('multiple', 'true');

            fileInputRef.current.onchange = async (e) => {
                const files = Array.from(e.target.files);

                if (files.length === 0) return;

                const newImages = [];

                for (const file of files) {
                    try {
                        // Upload the image to the server
                        const formData = new FormData();
                        formData.append('image', file);

                        const response = await fetch(`${API}/upload/image`, {
                            method: 'POST',
                            body: formData
                        });

                        if (response.ok) {
                            const result = await response.json();
                            let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                            // Convert full URL to relative path if needed
                            if (imageUrl.startsWith('http://localhost:5098')) {
                                imageUrl = imageUrl.replace('http://localhost:5098', '');
                            }

                            newImages.push({
                                id: Date.now() + Math.random(),
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                file: file,
                                url: imageUrl
                            });
                        } else {
                            // Fallback to blob URL if upload fails
                            newImages.push({
                                id: Date.now() + Math.random(),
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                file: file,
                                url: URL.createObjectURL(file)
                            });
                        }
                    } catch (error) {
                        console.error('Error uploading reference image:', error);
                        // Fallback to blob URL if upload fails
                        newImages.push({
                            id: Date.now() + Math.random(),
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            file: file,
                            url: URL.createObjectURL(file)
                        });
                    }
                }

                setNewReference(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
                }));

                // Reset the file input value to allow selecting the same files again
                e.target.value = '';
            };
        }

        // Trigger the file dialog
        try {
            fileInputRef.current.click();
        } catch (error) {
            console.error('Error clicking file input:', error);
        }
    };

    const removeReferenceImage = (imageId) => {
        setNewReference(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== imageId)
        }));
    };

    const handleBrowseEmployeeImage = async () => {
        // Create a file input element for employees
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    // Upload the image to the server
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(`${API}/upload/image`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const result = await response.json();
                        let imageUrl = result.imageUrl || `/uploads/${result.filename}`;
                        // Convert full URL to relative path if needed
                        if (imageUrl.startsWith('http://localhost:5098')) {
                            imageUrl = imageUrl.replace('http://localhost:5098', '');
                        }
                        setNewEmployee({ ...newEmployee, imageUrl: imageUrl });
                    } else {
                        // Fallback to blob URL if upload fails
                        const imageUrl = URL.createObjectURL(file);
                        setNewEmployee({ ...newEmployee, imageUrl: imageUrl });
                    }
                } catch (error) {
                    console.error('Error uploading employee image:', error);
                    // Fallback to blob URL if upload fails
                    const imageUrl = URL.createObjectURL(file);
                    setNewEmployee({ ...newEmployee, imageUrl: imageUrl });
                }
            }
        };
        input.click();
    };

    return (
        <div className="admin-about-container container-fluid">
            {/* First Section - Main Content */}
            <div className="admin-about-card p-3 mb-4">
                {/* Top Bar */}
                <div className="admin-about-topbar d-flex justify-content-between align-items-center mb-3">
                    <div className="slide-indicator">Slide 1</div>
                    <div className="top-actions d-flex gap-2">
                        <button className="delete-btn btn" aria-label="Delete">
                            <img src="/assets/admin-trash.png" alt="Delete" />
                        </button>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="admin-about-content row g-3 align-items-start">
                    {/* Left Side - Text Fields */}
                    <div className="content-left col-12 col-lg-8 d-flex flex-column gap-3">
                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Heading <span style={{ color: '#ff4d4f' }}>*</span></label>
                            <div className="col-sm-9">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Texnologiya ilə Gələcəyə Doğru"
                                    value={mainContent.heading}
                                    onChange={(e) => handleMainContentChange('heading', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Heading (EN)</label>
                            <div className="col-sm-9">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Heading in English"
                                    value={mainContent.headingEn}
                                    onChange={(e) => handleMainContentChange('headingEn', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Heading (RU)</label>
                            <div className="col-sm-9">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Заголовок на русском"
                                    value={mainContent.headingRu}
                                    onChange={(e) => handleMainContentChange('headingRu', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Subtext <span style={{ color: '#ff4d4f' }}>*</span></label>
                            <div className="col-sm-9">
                                <textarea
                                    className="form-control"
                                    placeholder="Şirkət haqqında məlumat..."
                                    value={mainContent.subtext}
                                    onChange={(e) => handleMainContentChange('subtext', e.target.value)}
                                    rows={6}
                                />
                            </div>
                        </div>

                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Subtext (EN)</label>
                            <div className="col-sm-9">
                                <textarea
                                    className="form-control"
                                    placeholder="Company description in English..."
                                    value={mainContent.subtextEn}
                                    onChange={(e) => handleMainContentChange('subtextEn', e.target.value)}
                                    rows={6}
                                />
                            </div>
                        </div>

                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Subtext (RU)</label>
                            <div className="col-sm-9">
                                <textarea
                                    className="form-control"
                                    placeholder="Описание компании на русском..."
                                    value={mainContent.subtextRu}
                                    onChange={(e) => handleMainContentChange('subtextRu', e.target.value)}
                                    rows={6}
                                />
                            </div>
                        </div>

                        <div className="form-group row g-3 align-items-start">
                            <label className="col-sm-3 col-form-label">Image URL</label>
                            <div className="col-sm-9">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Şəkil linki..."
                                    value={mainContent.imageUrl}
                                    onChange={(e) => handleMainContentChange('imageUrl', e.target.value)}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image Upload */}
                    <div className="content-right col-12 col-lg-4">
                        <div className="image-upload-container d-flex flex-column gap-2">
                            <div className="image-placeholder position-relative">
                                {mainContent.imageUrl && (
                                    <img
                                        src={resolveUrl(mainContent.imageUrl)}
                                        alt="Main content"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="image-actions position-absolute">
                                    <button className="action-btn delete-img" aria-label="Delete image" onClick={handleDeleteImage}>
                                        <img src="/assets/admin-trash.png" alt="Delete" />
                                    </button>
                                    <button className="action-btn refresh-img" aria-label="Browse image" onClick={handleBrowseImage}>
                                        <img src="/assets/admin-refresh.png" alt="Browse" />
                                    </button>
                                </div>
                            </div>
                            <div className="image-info">
                                *Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save/Undo buttons at bottom - always visible */}
                <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary" disabled={!hasMainContentChanges()} onClick={handleMainContentSave}>Yadda saxla</button>
                    <button className="btn btn-outline-light" disabled={!hasMainContentChanges()} onClick={handleMainContentUndo}>Undo</button>
                </div>
            </div>

            {/* References - Referanslar */}
            <div className="admin-about-card p-3 mt-4">
                <div className="admin-about-topbar d-flex justify-content-between align-items-center mb-3">
                    <div className="slide-indicator">Referanslar</div>
                    <div className="references-note">*Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır</div>
                </div>

                <div className="references-grid">
                    {/* Upload tile */}
                    <label className="upload-tile" onClick={handleAddReference}>
                        <div className="upload-inner">
                            <div className="upload-title">Click to upload</div>
                            <div className="upload-sub">or drag and drop</div>
                        </div>
                    </label>

                    {/* Reference items (images will be shown when fetched) */}
                    {references.map(ref => (
                        <div key={ref.id} className="reference-item">
                            <div className="reference-canvas">
                                {/* Show multiple images if available, otherwise fall back to single imageUrl */}
                                {ref.allImages && ref.allImages.length > 0 ? (
                                    <div className="reference-images-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: ref.allImages.length === 1 ? '1fr' :
                                            ref.allImages.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                                        gap: '8px',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        {ref.allImages.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={resolveUrl(imgUrl)}
                                                alt={`${ref.alt || ref.name} - Image ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : ref.imageUrl ? (
                                    <img
                                        src={resolveUrl(ref.imageUrl)}
                                        alt={ref.alt || ref.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <div className="no-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="reference-actions">
                                <button className="action-btn delete-img" aria-label="Delete reference" onClick={() => removeReference(ref.id)}>
                                    <img src="/assets/admin-trash.png" alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Second Section - Team/Collective */}
            <div className="admin-about-card p-3 mt-4">
                {/* Team Section Header */}
                <div className="admin-about-topbar d-flex justify-content-between align-items-center mb-3">
                    <div className="slide-indicator">Kollektiv</div>
                    <div className="top-actions d-flex gap-2">
                        <button className="add-btn btn" onClick={handleAddEmployee}>+ Əlavə et</button>
                    </div>
                </div>

                {/* Director Section - Always Present */}
                {director && (
                    <div className="team-member-section mb-4">
                        {/* Director Action Buttons */}
                        <div className="d-flex justify-content-end mb-3">
                            <div className="d-flex gap-2">
                                {/* Save/Undo buttons moved to bottom */}
                            </div>
                        </div>

                        <div className="row g-3 align-items-start">
                            {/* Left Side - Form Fields */}
                            <div className="col-12 col-lg-8">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Heading</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Əli Məmmədov"
                                                    value={director.name || ''}
                                                    onChange={(e) => handleDirectorChange('name', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Job name</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Direktor"
                                                    value={director.position || ''}
                                                    onChange={(e) => handleDirectorChange('position', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Director Position (EN) */}
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Job name (EN)</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Director"
                                                    value={director.positionEn || ''}
                                                    onChange={(e) => handleDirectorChange('positionEn', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Director Position (RU) */}
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Job name (RU)</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Директор"
                                                    value={director.positionRu || ''}
                                                    onChange={(e) => handleDirectorChange('positionRu', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Subtext</label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Təsvir..."
                                                    value={director.description || ''}
                                                    onChange={(e) => handleDirectorChange('description', e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Director Description (EN) */}
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Subtext (EN)</label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Description..."
                                                    value={director.descriptionEn || ''}
                                                    onChange={(e) => handleDirectorChange('descriptionEn', e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Director Description (RU) */}
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Subtext (RU)</label>
                                            <div className="col-sm-9">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Описание..."
                                                    value={director.descriptionRu || ''}
                                                    onChange={(e) => handleDirectorChange('descriptionRu', e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Telefon</label>
                                                    <input
                                                        className="form-control"
                                                        type="tel"
                                                        placeholder="+994 50 123 45 67"
                                                        value={director.phone || ''}
                                                        onChange={(e) => handleDirectorChange('phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Mail</label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        placeholder="ali.mammadov@webonly.az"
                                                        value={director.email || ''}
                                                        onChange={(e) => handleDirectorChange('email', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">LinkedIn</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="linkedin.com/in/ali-mammadov"
                                                        value={director.linkedin || ''}
                                                        onChange={(e) => handleDirectorChange('linkedin', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Image Upload */}
                            <div className="col-12 col-lg-4">
                                <div className="image-upload-container d-flex flex-column gap-2">
                                    <div className="image-placeholder position-relative">
                                        {director.imageUrl && (
                                            <img
                                                src={resolveUrl(director.imageUrl)}
                                                alt={director.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={handleDirectorImageDelete}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={handleDirectorImageBrowse}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="image-info">
                                        *Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save/Undo buttons at bottom - always visible */}
                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-primary" disabled={!hasDirectorChanges()} onClick={handleDirectorSave}>Yadda saxla</button>
                            <button className="btn btn-outline-light" disabled={!hasDirectorChanges()} onClick={handleDirectorUndo}>Undo</button>
                        </div>
                    </div>
                )}

                {/* Employee Sections - Dynamic */}
                {employees.map((employee) => (
                    <div key={employee.id} className="team-member-section mb-4">
                        <div className="d-flex justify-content-end mb-3">
                            <div className="d-flex gap-2">
                                <button
                                    className="delete-btn btn btn-sm"
                                    onClick={() => removeEmployee(employee.id)}
                                    aria-label="Delete employee"
                                >
                                    <img src="/assets/admin-trash.png" alt="Delete" />
                                </button>
                            </div>
                        </div>

                        <div className="row g-3 align-items-start">
                            {/* Left Side - Form Fields */}
                            <div className="col-12 col-lg-8">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Heading</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={employee.name || ''}
                                                    onChange={(e) => handleEmployeeChange(employee.id, 'name', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Heading (EN)</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={employee.nameEn || ''}
                                                    onChange={(e) => handleEmployeeChange(employee.id, 'nameEn', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Heading (RU)</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={employee.nameRu || ''}
                                                    onChange={(e) => handleEmployeeChange(employee.id, 'nameRu', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Job name</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={employee.position || ''}
                                                    onChange={(e) => handleEmployeeChange(employee.id, 'position', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Job name (EN)</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={employee.positionEn || ''}
                                                    onChange={(e) => handleEmployeeChange(employee.id, 'positionEn', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group row g-3 align-items-start">
                                            <label className="col-sm-3 col-form-label">Job name (RU)</label>
                                            <div className="col-sm-9">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={employee.positionRu || ''}
                                                    onChange={(e) => handleEmployeeChange(employee.id, 'positionRu', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* No description fields for non-director employees */}
                                    <div className="col-12">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Telefon</label>
                                                    <input
                                                        className="form-control"
                                                        type="tel"
                                                        value={employee.phone || ''}
                                                        onChange={(e) => handleEmployeeChange(employee.id, 'phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Mail</label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        value={employee.email || ''}
                                                        onChange={(e) => handleEmployeeChange(employee.id, 'email', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">LinkedIn</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={employee.linkedin || ''}
                                                        onChange={(e) => handleEmployeeChange(employee.id, 'linkedin', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Image Display */}
                            <div className="col-12 col-lg-4">
                                <div className="image-upload-container d-flex flex-column gap-2">
                                    <div className="image-placeholder position-relative">
                                        {employee.imageUrl && (
                                            <img
                                                src={resolveUrl(employee.imageUrl)}
                                                alt={employee.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="image-actions position-absolute">
                                            <button className="action-btn delete-img" aria-label="Delete image" onClick={() => handleEmployeeImageDelete(employee.id)}>
                                                <img src="/assets/admin-trash.png" alt="Delete" />
                                            </button>
                                            <button className="action-btn refresh-img" aria-label="Browse image" onClick={() => handleEmployeeImageBrowse(employee.id)}>
                                                <img src="/assets/admin-refresh.png" alt="Browse" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="image-info">
                                        *Yüklənən şəkil aaa x bbb ölçüsündə olmalıdır
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save/Undo buttons at bottom - always visible */}
                        <div className="d-flex gap-2 mt-3">
                            <button className="btn btn-primary" disabled={!hasEmployeeChanges(employee.id)} onClick={() => handleEmployeeSave(employee.id)}>Yadda saxla</button>
                            <button className="btn btn-outline-light" disabled={!hasEmployeeChanges(employee.id)} onClick={() => handleEmployeeUndo(employee.id)}>Undo</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Employee/Reference Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {modalType === 'employee' ? 'Yeni İşçi Əlavə Et' : 'Yeni Referans Əlavə Et'}
                            </h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            {modalType === 'employee' ? (
                                <>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Ad Soyad <span style={{ color: '#ff4d4f' }}>*</span></label>
                                        <input
                                            className="form-control"
                                            placeholder="İşçi adını daxil edin"
                                            value={newEmployee.name}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Ad Soyad (EN)</label>
                                        <input
                                            className="form-control"
                                            placeholder="Employee name in English"
                                            value={newEmployee.nameEn || ''}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, nameEn: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Ad Soyad (RU)</label>
                                        <input
                                            className="form-control"
                                            placeholder="Имя сотрудника на русском"
                                            value={newEmployee.nameRu || ''}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, nameRu: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Vəzifə <span style={{ color: '#ff4d4f' }}>*</span></label>
                                        <input
                                            className="form-control"
                                            placeholder="İşçi vəzifəsini daxil edin"
                                            value={newEmployee.position}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Təsvir</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="İşçi haqqında təsvir..."
                                            value={newEmployee.description}
                                            onChange={(e) => setNewEmployee({ ...newEmployee, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Şəkil</label>
                                        <div className="d-flex gap-2">
                                            <input
                                                className="form-control"
                                                placeholder=""
                                                value={newEmployee.imageUrl ? 'Şəkil seçildi' : ''}
                                                disabled
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={handleBrowseEmployeeImage}
                                            >
                                                Browse
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Telefon <span style={{ color: '#ff4d4f' }}>*</span></label>
                                            <input
                                                className="form-control"
                                                placeholder="+994 50 123 45 67"
                                                value={newEmployee.phone}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Mail <span style={{ color: '#ff4d4f' }}>*</span></label>
                                            <input
                                                className="form-control"
                                                placeholder="email@example.com"
                                                value={newEmployee.email}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">LinkedIn <span style={{ color: '#ff4d4f' }}>*</span></label>
                                            <input
                                                className="form-control"
                                                placeholder="linkedin.com/in/username"
                                                value={newEmployee.linkedin}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, linkedin: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Referans Adı <span style={{ color: '#ff4d4f' }}>*</span></label>
                                        <input
                                            className="form-control"
                                            placeholder="Referans adını daxil edin"
                                            value={newReference.name}
                                            onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Şəkillər <span style={{ color: '#ff4d4f' }}>*</span></label>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary w-100 mb-2"
                                            onClick={handleBrowseReferenceImage}
                                        >
                                            Browse Images
                                        </button>

                                        {/* Display selected images */}
                                        {newReference.images.length > 0 && (
                                            <div className="selected-images">
                                                <h6>Seçilən şəkillər ({newReference.images.length}):</h6>
                                                <div className="row g-2">
                                                    {newReference.images.map((img, index) => (
                                                        <div key={img.id} className="col-md-4">
                                                            <div className="selected-image-item position-relative">
                                                                <img
                                                                    src={img.url}
                                                                    alt={img.name}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '8px'
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger position-absolute"
                                                                    style={{ top: '5px', right: '5px' }}
                                                                    onClick={() => removeReferenceImage(img.id)}
                                                                >
                                                                    ×
                                                                </button>
                                                                <small className="d-block mt-1 text-center">{img.name}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">Alt</label>
                                        <input
                                            className="form-control"
                                            placeholder="Alt mətn..."
                                            value={newReference.alt}
                                            onChange={(e) => setNewReference({ ...newReference, alt: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>Ləğv et</button>
                            <button className="btn btn-primary" onClick={handleSave}>Əlavə et</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 