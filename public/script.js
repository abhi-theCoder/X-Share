// X Share - Main JavaScript File

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initializePage();
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form handling
class FormHandler {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 3;
        this.formData = {};
    }

    nextStep() {
        if (this.currentStep < this.maxSteps) {
            this.hideStep(this.currentStep);
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    hideStep(step) {
        const stepElement = document.querySelector(`[data-step="${step}"]`);
        if (stepElement) {
            stepElement.style.display = 'none';
        }
    }

    showStep(step) {
        const stepElement = document.querySelector(`[data-step="${step}"]`);
        if (stepElement) {
            stepElement.style.display = 'block';
            stepElement.classList.add('fade-in');
        }
    }

    updateProgress() {
        const progressBars = document.querySelectorAll('.progress-step');
        progressBars.forEach((bar, index) => {
            if (index < this.currentStep) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    }

    collectFormData() {
        const form = document.querySelector('#experienceForm');
        if (form) {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            return data;
        }
        return {};
    }

    submitForm() {
        const data = this.collectFormData();
        
        // Simulate form submission
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            showToast('Experience submitted successfully! Redirecting...', 'success');
            // Reset form or redirect
            setTimeout(() => {
                window.location.href = 'guidance.html';
            }, 2000);
        }, 1500);
    }

    showLoading() {
        const submitBtn = document.querySelector('#submitBtn');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Submitting...';
            lucide.createIcons();
        }
    }

    hideLoading() {
        const submitBtn = document.querySelector('#submitBtn');
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i data-lucide="check"></i> Submit Experience';
            lucide.createIcons();
        }
    }
}

// Authentication handler
class AuthHandler {
    constructor() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

    login(email, password) {
        // Simulate login
        if (email && password) {
            this.isLoggedIn = true;
            this.currentUser = {
                email: email,
                name: email.split('@')[0],
                role: 'student'
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            return true;
        }
        return false;
    }

    signup(email, password, name) {
        // Simulate signup
        if (email && password && name) {
            this.isLoggedIn = true;
            this.currentUser = {
                email: email,
                name: name,
                role: 'student'
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            return true;
        }
        return false;
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = {};
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Experience data manager
class ExperienceManager {
    constructor() {
        this.experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
        this.initializeDummyData();
    }

    initializeDummyData() {
        if (this.experiences.length === 0) {
            this.experiences = [
                {
                    id: 1,
                    category: 'internship',
                    company: 'Google',
                    role: 'Software Engineer Intern',
                    duration: '3 months',
                    stipend: '₹80,000/month',
                    experience: 'Amazing learning experience with great mentorship and challenging projects.',
                    tips: 'Focus on data structures and algorithms. Practice system design basics.',
                    author: 'Rahul Kumar',
                    date: '2023-12-01',
                    status: 'approved'
                },
                {
                    id: 2,
                    category: 'placement',
                    company: 'Microsoft',
                    role: 'Software Development Engineer',
                    year: '2024',
                    salary: '₹42 LPA',
                    rounds: 'Online Test, Technical Interview (2 rounds), HR Interview',
                    experience: 'Rigorous but fair interview process. Technical rounds focused on problem-solving.',
                    tips: 'Be thorough with fundamentals. Practice coding problems daily.',
                    author: 'Priya Singh',
                    date: '2024-01-15',
                    status: 'approved'
                },
                {
                    id: 3,
                    category: 'hackathon',
                    eventName: 'Smart India Hackathon',
                    date: '2023-11-20',
                    topic: 'Smart City Solutions',
                    outcome: 'Winner - Best Innovation Award',
                    experience: 'Intense 36-hour coding marathon. Built a traffic management system using IoT.',
                    lessons: 'Teamwork and time management are crucial. Have a working prototype early.',
                    author: 'Arjun Patel',
                    date: '2023-11-25',
                    status: 'approved'
                }
            ];
            this.saveExperiences();
        }
    }

    addExperience(experience) {
        experience.id = Date.now();
        experience.date = new Date().toISOString().split('T')[0];
        experience.status = 'pending';
        this.experiences.push(experience);
        this.saveExperiences();
        return experience;
    }

    getExperiences(category = null, status = 'approved') {
        let filtered = this.experiences.filter(exp => exp.status === status);
        if (category) {
            filtered = filtered.filter(exp => exp.category === category);
        }
        return filtered;
    }

    getPendingExperiences() {
        return this.experiences.filter(exp => exp.status === 'pending');
    }

    approveExperience(id) {
        const experience = this.experiences.find(exp => exp.id === id);
        if (experience) {
            experience.status = 'approved';
            this.saveExperiences();
            return true;
        }
        return false;
    }

    rejectExperience(id) {
        this.experiences = this.experiences.filter(exp => exp.id !== id);
        this.saveExperiences();
        return true;
    }

    saveExperiences() {
        localStorage.setItem('experiences', JSON.stringify(this.experiences));
    }
}

// Global instances
const formHandler = new FormHandler();
const authHandler = new AuthHandler();
const experienceManager = new ExperienceManager();

// Utility functions
function showToast(message, type = 'success', duration = 3000) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') {
        icon = '<i data-lucide="check-circle" class="mr-2"></i>';
    } else if (type === 'error') {
        icon = '<i data-lucide="alert-triangle" class="mr-2"></i>';
    } else if (type === 'info') {
        icon = '<i data-lucide="info" class="mr-2"></i>';
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.remove();
    }, duration);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Page-specific initialization
function initializePage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(page) {
        case 'index.html':
        case '':
            // Homepage is already initialized
            break;
        case 'login.html':
            initializeLoginPage();
            break;
        case 'share.html':
            initializeSharePage();
            break;
        case 'guidance.html':
            initializeGuidancePage();
            break;
        case 'admin.html':
            initializeAdminPage();
            break;
    }
}