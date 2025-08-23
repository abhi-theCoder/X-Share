// X Share - Main JavaScript File

// Declare global variables for instances to be used across functions
let experienceManager, authHandler;

/**
 * Initializes the page by rendering the experiences and attaching event listeners.
 * This function is called once the DOM is fully loaded.
 */
function initializePage() {
    authHandler = new AuthHandler();
    experienceManager = new ExperienceManager();
    
    // Initial render of all experiences
    renderExperiences();
    
    // Attach a single global click listener to the parent container
    attachGlobalEventListeners();
    
    // Create Lucide icons once
    lucide.createIcons();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializePage);

// AuthenticationHandler Class: Manages user login and state
class AuthHandler {
    constructor() {
        this.isLoggedIn = true; // Set to true for demo purposes
        this.currentUser = { name: 'Demo User', email: 'demo@example.com', role: 'student' };
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// ExperienceManager Class: Manages detailed experience data
class ExperienceManager {
    constructor() {
        this.experiences = [];
        this.loadExperiences();
    }
    
    loadExperiences() {
        // First, try to load from the 'approvedExperiences' key used by the admin page
        const approvedData = JSON.parse(localStorage.getItem('approvedExperiences'));
        
        if (approvedData && approvedData.length > 0) {
            // Normalize the data to match the expected format
            this.experiences = approvedData.map(exp => ({
                id: exp.id,
                category: exp.category || exp['position-type'] || "unknown",
                companyName: exp.companyName || exp['company-name'] || "Unknown Company",
                role: exp.role || "Unknown Role",
                author: exp.author || "N/A",
                date: exp.date || new Date().toISOString(),
                downvotes: exp.downvotes || [],
                files: exp.files || [],
                hrQuestions: exp.hrQuestions || exp['hr-questions'] || "N/A",
                interviewDate: exp.interviewDate || exp['interview-date'] || "N/A",
                location: exp.location || "N/A",
                positionType: exp.positionType || exp['position-type'] || "unknown",
                rounds: exp.rounds || exp['round'] || [],
                status: exp.status || 'approved',
                technicalQuestions: exp.technicalQuestions || exp['technical-questions'] || "N/A",
                tips: exp.tips || "N/A",
                upvotes: exp.upvotes || [],
                comments: exp.comments || []
            }));
        } else {
            // Fallback to the original sample data if no approved data is found
            this.experiences = [
                {
                    id: 1,
                    category: "internship",
                    companyName: "Google",
                    role: "Software Engineer Intern",
                    author: "Rahul Kumar",
                    date: "2023-12-01",
                    downvotes: [],
                    files: ["resume.pdf", "coding_samples.zip"],
                    hrQuestions: "Tell me about yourself. Why do you want to work at Google? What are your strengths and weaknesses? Describe a challenging project you worked on.",
                    interviewDate: "2023-11-15",
                    location: "Bangalore",
                    positionType: "internship",
                    rounds: ["Aptitude Test", "Technical Round", "HR Round"],
                    status: "approved",
                    technicalQuestions: "Asked about data structures like arrays, linked lists, and trees. Coding problems on sorting algorithms and binary search. System design basics - how would you design a simple chat application.",
                    tips: "Practice coding problems on LeetCode daily. Focus on data structures and algorithms. Prepare system design basics. Be confident during HR round and have good examples ready.",
                    upvotes: [],
                    comments: [
                        { author: 'User A', text: 'Thanks for the detailed experience!', date: '2023-12-02' },
                        { author: 'User B', text: 'This is super helpful for preparation.', date: '2023-12-03' }
                    ]
                },
                {
                    id: 2,
                    category: "placement",
                    companyName: "Microsoft",
                    role: "Software Development Engineer",
                    author: "Priya Singh",
                    date: "2024-01-15",
                    downvotes: [],
                    files: ["portfolio.pdf"],
                    hrQuestions: "Why Microsoft? Where do you see yourself in 5 years? Tell me about a time you faced a difficult situation and how you handled it.",
                    interviewDate: "2024-01-10",
                    location: "Hyderabad",
                    positionType: "full-time",
                    rounds: ["Aptitude Test", "Technical Round"],
                    status: "approved",
                    technicalQuestions: "Given an array, find the maximum sum subarray. Design a parking lot system. Questions on object-oriented programming concepts. Database queries and normalization.",
                    tips: "Be thorough with fundamentals of programming. Practice system design problems. Research about Microsoft products and services. Show enthusiasm and passion for technology.",
                    upvotes: ["user123", "Demo User"],
                    comments: []
                },
                {
                    id: 3,
                    category: "hackathon",
                    companyName: "Smart India Hackathon",
                    role: "Participant",
                    author: "Arjun Patel",
                    date: "2023-11-25",
                    downvotes: [],
                    files: ["presentation.pptx", "demo_video.mp4"],
                    hrQuestions: "How did your team collaborate? What was your individual contribution? How would you improve your solution given more time?",
                    interviewDate: "2023-11-20",
                    location: "Delhi",
                    positionType: "hackathon",
                    rounds: ["Problem Statement Selection", "Prototype Development", "Final Presentation"],
                    status: "approved",
                    technicalQuestions: "How does your solution address the problem statement? What technologies did you use and why? How would you scale this solution?",
                    tips: "Choose a problem statement you are passionate about. Have a working prototype early. Focus on user experience. Practice your presentation skills. Show the impact of your solution.",
                    upvotes: [],
                    downvotes: [],
                    comments: []
                }
            ];
        }
        
        // Save the normalized data back to the original key for consistency
        localStorage.setItem('experiences', JSON.stringify(this.experiences));
    }

    saveExperiences() {
        localStorage.setItem('experiences', JSON.stringify(this.experiences));
    }

    getExperiences(status = 'approved') {
        return this.experiences.filter(exp => exp.status === status);
    }

    addVote(id, voteType, userId) {
        const experience = this.experiences.find(exp => exp.id === id);
        if (!experience) return false;

        const hasUpvoted = (experience.upvotes || []).includes(userId);
        const hasDownvoted = (experience.downvotes || []).includes(userId);

        if (voteType === 'upvote') {
            if (hasUpvoted) {
                experience.upvotes = experience.upvotes.filter(uid => uid !== userId);
            } else {
                if (hasDownvoted) {
                    experience.downvotes = experience.downvotes.filter(uid => uid !== userId);
                }
                experience.upvotes.push(userId);
            }
        } else if (voteType === 'downvote') {
            if (hasDownvoted) {
                experience.downvotes = experience.downvotes.filter(uid => uid !== userId);
            } else {
                if (hasUpvoted) {
                    experience.upvotes = experience.upvotes.filter(uid => uid !== userId);
                }
                experience.downvotes.push(userId);
            }
        }
        this.saveExperiences(); // Save changes to local storage
        return experience;
    }

    addComment(id, author, text) {
        const experience = this.experiences.find(exp => exp.id === id);
        if (experience) {
            const newComment = {
                author: author,
                text: text,
                date: new Date().toISOString()
            };
            if (!experience.comments) {
                experience.comments = [];
            }
            experience.comments.push(newComment);
            this.saveExperiences();
            return newComment;
        }
        return null;
    }
}

// Utility function to show toast notifications
function showToast(message, type = 'success', duration = 3000) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container fixed top-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast bg-white border-l-4 shadow-lg p-4 mb-2 rounded flex items-center ${type === 'success' ? 'border-green-500 text-green-700' : type === 'error' ? 'border-red-500 text-red-700' : 'border-blue-500 text-blue-700'}`;
    
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
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
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

function filterExperiences(searchQuery, category) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const expCategory = card.dataset.category;
        const expText = card.textContent.toLowerCase();
        
        const categoryMatch = category === 'all' || expCategory === category;
        const searchMatch = expText.includes(searchQuery.toLowerCase());
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Renders all approved experiences to the page with detailed 6-step information
function renderExperiences(experiencesToRender = null) {
    const experiencesList = document.getElementById('experiencesList');
    experiencesList.innerHTML = '';
    
    const experiences = experiencesToRender || experienceManager.getExperiences();
    const currentUser = authHandler.getCurrentUser();
    const userId = currentUser.name || 'guest';

    if (experiences.length === 0) {
        experiencesList.innerHTML = '<p class="text-center text-gray-500 text-lg py-16">No experiences found. Try a different search or filter.</p>';
        return;
    }

    experiences.forEach(exp => {
        const card = document.createElement('div');
        card.className = `card bg-white rounded-3xl shadow-xl overflow-hidden`;
        card.dataset.id = exp.id;
        card.dataset.category = exp.category; // Add category data attribute

        const isUpvoted = (exp.upvotes || []).includes(userId);
        const isDownvoted = (exp.downvotes || []).includes(userId);

        card.innerHTML = `
            <div class="p-8">
                <div class="card-header flex justify-between items-center mb-4 cursor-pointer">
                    <div>
                        <span class="text-sm font-semibold text-white px-3 py-1 rounded-xl ${exp.category === 'internship' ? 'bg-blue-600' : exp.category === 'placement' ? 'bg-green-600' : 'bg-purple-600'}">${exp.positionType.toUpperCase()}</span>
                        <h2 class="text-2xl font-bold text-gray-800 mt-2">${exp.companyName} - ${exp.role}</h2>
                        <p class="text-gray-500 text-sm">${exp.author} • ${formatDate(exp.date)} • ${exp.location}</p>
                    </div>
                    <i data-lucide="chevron-down" class="chevron-icon transform transition-transform text-gray-400 h-6 w-6"></i>
                </div>
                
                <div class="card-content space-y-8">
                    <div class="bg-gray-50 p-6 rounded-xl">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3">1</div>
                            Company Information
                        </h3>
                        <div class="info-grid">
                            <div class="flex items-center text-gray-600">
                                <i data-lucide="briefcase" class="mr-2 h-5 w-5"></i>
                                <span class="font-medium">Company:</span>
                                <span class="ml-2">${exp.companyName}</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i data-lucide="user" class="mr-2 h-5 w-5"></i>
                                <span class="font-medium">Role:</span>
                                <span class="ml-2">${exp.role}</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i data-lucide="calendar" class="mr-2 h-5 w-5"></i>
                                <span class="font-medium">Interview Date:</span>
                                <span class="ml-2">${exp.interviewDate}</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i data-lucide="map-pin" class="mr-2 h-5 w-5"></i>
                                <span class="font-medium">Location:</span>
                                <span class="ml-2">${exp.location}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3">2</div>
                            Selection Rounds
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            ${(exp.rounds || []).map(round => `
                                <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-medium">${round}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3">3</div>
                            Questions Asked
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                                    <i data-lucide="code" class="mr-2 h-4 w-4"></i>
                                    Technical Questions
                                </h4>
                                <p class="text-gray-600 bg-white p-4 rounded-lg">${exp.technicalQuestions}</p>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                                    <i data-lucide="message-circle" class="mr-2 h-4 w-4"></i>
                                    HR Questions
                                </h4>
                                <p class="text-gray-600 bg-white p-4 rounded-lg">${exp.hrQuestions}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3">4</div>
                            Tips & Advice
                        </h3>
                        <div class="flex items-start text-gray-600">
                            <i data-lucide="lightbulb" class="mr-2 h-5 w-5 mt-1 text-yellow-500"></i>
                            <p class="bg-white p-4 rounded-lg">${exp.tips}</p>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-xl">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mr-3">5</div>
                            Shared Files
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            ${(exp.files || []).map(file => `
                                <div class="flex items-center bg-white px-4 py-2 rounded-lg">
                                    <i data-lucide="file" class="mr-2 h-4 w-4 text-gray-500"></i>
                                    <span class="text-sm text-gray-700">${file}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="vote-section flex items-center space-x-4 pt-4 border-t border-gray-200">
                        <span class="text-sm font-medium text-gray-700">Was this helpful?</span>
                        <div class="flex items-center space-x-1">
                            <button class="upvote-btn text-gray-500 hover:text-green-600 transition-colors ${isUpvoted ? 'voted !text-green-600' : ''}" data-id="${exp.id}">
                                <i data-lucide="thumbs-up" class="h-5 w-5"></i>
                            </button>
                            <span class="upvote-count text-sm">${(exp.upvotes || []).length}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            <button class="downvote-btn text-gray-500 hover:text-red-600 transition-colors ${isDownvoted ? 'voted !text-red-600' : ''}" data-id="${exp.id}">
                                <i data-lucide="thumbs-down" class="h-5 w-5"></i>
                            </button>
                            <span class="downvote-count text-sm">${(exp.downvotes || []).length}</span>
                        </div>
                    </div>

                    <div class="comments-section">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Comments</h3>
                        <div id="comments-${exp.id}" class="comments-list space-y-4 mb-4">
                            ${ (exp.comments || []).map(comment => `
                                <div class="bg-gray-50 p-4 rounded-lg text-sm">
                                    <p class="font-semibold text-gray-700">${comment.author}</p>
                                    <p class="text-gray-600 mt-1">${comment.text}</p>
                                    <p class="text-gray-400 text-xs mt-2">${formatDate(comment.date)}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="comment-form flex items-center space-x-3" data-id="${exp.id}">
                            <input type="text" placeholder="Add a comment..." class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none comment-input">
                            <button type="button" class="comment-submit-btn bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition" data-id="${exp.id}">
                                <i data-lucide="send" class="h-5 w-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        experiencesList.appendChild(card);
    });

    lucide.createIcons(); // Ensure icons are created for newly added HTML
}

// Attaches event listeners for static elements (called once)
function attachGlobalEventListeners() {
    let currentCategory = 'all';

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-600');
            });
            this.classList.remove('bg-gray-100', 'text-gray-600');
            this.classList.add('bg-blue-600', 'text-white');

            currentCategory = this.dataset.category;
            const searchQuery = document.getElementById('searchInput').value.trim();
            filterExperiences(searchQuery, currentCategory);
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('keyup', function() {
        const searchQuery = this.value.trim();
        const activeCategoryBtn = document.querySelector('.filter-btn.bg-blue-600');
        const category = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';
        filterExperiences(searchQuery, category);
    });

    // Event Delegation for dynamic content
    const experiencesList = document.getElementById('experiencesList');
    experiencesList.addEventListener('click', function(e) {
        // Card Header Toggle
        const cardHeader = e.target.closest('.card-header');
        if (cardHeader) {
            const card = cardHeader.closest('.card');
            card.classList.toggle('expanded');
            return;
        }

        // Voting Buttons
        const upvoteBtn = e.target.closest('.upvote-btn');
        const downvoteBtn = e.target.closest('.downvote-btn');
        if (upvoteBtn || downvoteBtn) {
            const btn = upvoteBtn || downvoteBtn;
            const experienceId = parseInt(btn.dataset.id);
            const voteType = btn.classList.contains('upvote-btn') ? 'upvote' : 'downvote';
            const currentUser = authHandler.getCurrentUser();
            const userId = currentUser.name || 'guest';
            
            if (authHandler.isAuthenticated()) {
                const updatedExperience = experienceManager.addVote(experienceId, voteType, userId);
                if(updatedExperience) {
                    const cardElement = btn.closest('.card');
                    const upvoteCountSpan = cardElement.querySelector('.upvote-count');
                    const downvoteCountSpan = cardElement.querySelector('.downvote-count');
                    const upvoteBtnElement = cardElement.querySelector('.upvote-btn');
                    const downvoteBtnElement = cardElement.querySelector('.downvote-btn');
                    
                    upvoteCountSpan.textContent = (updatedExperience.upvotes || []).length;
                    downvoteCountSpan.textContent = (updatedExperience.downvotes || []).length;

                    const isUpvoted = (updatedExperience.upvotes || []).includes(userId);
                    const isDownvoted = (updatedExperience.downvotes || []).includes(userId);

                    if (isUpvoted) {
                        upvoteBtnElement.classList.add('voted', '!text-green-600');
                    } else {
                        upvoteBtnElement.classList.remove('voted', '!text-green-600');
                    }
                    
                    if (isDownvoted) {
                        downvoteBtnElement.classList.add('voted', '!text-red-600');
                    } else {
                        downvoteBtnElement.classList.remove('voted', '!text-red-600');
                    }
                }
                showToast(`Your ${voteType} has been recorded!`, 'success');
            } else {
                showToast('Please log in to vote.', 'info');
            }
            return;
        }

        // Comment submission
        const commentSubmitBtn = e.target.closest('.comment-submit-btn');
        if (commentSubmitBtn) {
            const experienceId = parseInt(commentSubmitBtn.dataset.id);
            const commentForm = commentSubmitBtn.closest('.comment-form');
            const commentInput = commentForm.querySelector('.comment-input');
            const commentText = commentInput.value.trim();
            const currentUser = authHandler.getCurrentUser();

            if (!authHandler.isAuthenticated()) {
                showToast('Please log in to comment.', 'info');
                return;
            }

            if (commentText) {
                const author = currentUser.name;
                const newComment = experienceManager.addComment(experienceId, author, commentText);
                
                if(newComment) {
                    const commentsList = commentForm.closest('.comments-section').querySelector('.comments-list');
                    const commentHtml = `
                        <div class="bg-gray-50 p-4 rounded-lg text-sm">
                            <p class="font-semibold text-gray-700">${newComment.author}</p>
                            <p class="text-gray-600 mt-1">${newComment.text}</p>
                            <p class="text-gray-400 text-xs mt-2">${formatDate(newComment.date)}</p>
                        </div>
                    `;
                    commentsList.insertAdjacentHTML('beforeend', commentHtml);
                    commentInput.value = '';
                }
                showToast('Comment added successfully!', 'success');
            }
            return;
        }
    });

    // Allow Enter key to submit comments (Event Delegation)
    experiencesList.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const input = e.target.closest('.comment-input');
            if (input) {
                e.preventDefault();
                const submitBtn = input.closest('.comment-form').querySelector('.comment-submit-btn');
                submitBtn.click();
            }
        }
    });
}