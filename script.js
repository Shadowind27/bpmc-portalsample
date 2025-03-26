// Initialize Supabase
const supabaseUrl = "https://kwffxhmmauoeconqfrgy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ZmZ4aG1tYXVvZWNvbnFmcmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTU4NDgsImV4cCI6MjA1ODU3MTg0OH0.u4smcDvKrz-nPMXPVzhdD4mPYT1WYuA2JGB_97mzJtI";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Login Function
async function login() {
    const memberId = document.getElementById("memberId").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-msg");

    if (!memberId || !password) {
        errorMsg.innerText = "Please enter Membership ID and Password.";
        return;
    }

    let { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('membership_id', memberId)
        .single();

    if (error || !data) {
        errorMsg.innerText = "Invalid Membership ID.";
        return;
    }

    if (data.password !== password) {
        errorMsg.innerText = "Incorrect Password.";
        return;
    }

    localStorage.setItem("member", JSON.stringify(data));
    window.location.href = "dashboard.html";
}

// Load Dashboard Data
async function loadDashboard() {
    let member = JSON.parse(localStorage.getItem("member"));
    if (!member) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("fullName").innerText = member.full_name;
    document.getElementById("membershipId").innerText = member.membership_id;
    document.getElementById("dateOfMembership").innerText = member.date_of_membership;
    document.getElementById("capitalShare").innerText = member.capital_share.toLocaleString();

    let loanStatusElement = document.getElementById("loanStatus");
    if (member.loan_status && member.loan_status.active) {
        loanStatusElement.innerText = `Active Loan: ₱${member.loan_status.amount.toLocaleString()}`;
    } else {
        loanStatusElement.innerText = "No Active Loans.";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("member");
    window.location.href = "login.html";
}

// Forgot Password - Verify Member ID
async function verifyMember() {
    const memberId = document.getElementById("resetMemberId").value.trim();
    const errorMsg = document.getElementById("reset-error-msg");

    let { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('membership_id', memberId)
        .single();

    if (error || !data) {
        errorMsg.innerText = "Membership ID not found.";
        return;
    }

    // If valid, show new password input
    document.getElementById("newPasswordSection").style.display = "block";
}

// Forgot Password - Reset Password
async function resetPassword() {
    const memberId = document.getElementById("resetMemberId").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const errorMsg = document.getElementById("reset-error-msg");

    if (!newPassword) {
        errorMsg.innerText = "Please enter a new password.";
        return;
    }

    let { error } = await supabase
        .from('members')
        .update({ password: newPassword })
        .eq('membership_id', memberId);

    if (error) {
        errorMsg.innerText = "Error updating password.";
        return;
    }

    alert("Password successfully reset! Please log in.");
    window.location.href = "login.html";
}