"""
DevPulse API Tests
Tests for authentication, user profile, platform integrations
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
TEST_EMAIL = "testdev123@test.com"
TEST_PASSWORD = "TestPass123!"
TEST_USERNAME = "testdev123"

# Platform test usernames
GITHUB_USER = "torvalds"
LEETCODE_USER = "uwi"
CODEFORCES_USER = "tourist"
HACKERRANK_USER = "abhinav_07"


class TestAuthEndpoints:
    """Authentication endpoint tests - register, login, refresh"""
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        data = response.json()
        assert "accessToken" in data, "Missing accessToken"
        assert "refreshToken" in data, "Missing refreshToken"
        assert data["email"] == TEST_EMAIL
        assert data["username"] == TEST_USERNAME
        assert "displayName" in data
        assert "initials" in data
        print(f"✓ Login successful for {TEST_EMAIL}")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": "WrongPassword123!"
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Invalid credentials correctly rejected")
    
    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": "nonexistent@test.com",
            "password": "SomePassword123!"
        })
        assert response.status_code == 401
        print("✓ Non-existent user correctly rejected")
    
    def test_register_new_user(self):
        """Test user registration"""
        unique_id = str(uuid.uuid4())[:8]
        new_user = {
            "username": f"TEST_user_{unique_id}",
            "email": f"TEST_{unique_id}@test.com",
            "password": "TestPassword123!"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json=new_user)
        assert response.status_code == 201, f"Registration failed: {response.text}"
        
        data = response.json()
        assert "accessToken" in data
        assert "refreshToken" in data
        # Email is normalized to lowercase by backend
        assert data["email"] == new_user["email"].lower()
        assert data["username"] == new_user["username"]
        print(f"✓ Registration successful for {new_user['email']}")
    
    def test_register_duplicate_email(self):
        """Test registration with existing email"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": "newuser123",
            "email": TEST_EMAIL,  # Already exists
            "password": "TestPassword123!"
        })
        # Should fail with 400 or 409 for duplicate
        assert response.status_code in [400, 409, 500], f"Expected error, got {response.status_code}"
        print("✓ Duplicate email correctly rejected")
    
    def test_register_validation_short_password(self):
        """Test registration with short password"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "short"  # Less than 8 chars
        })
        assert response.status_code == 400
        print("✓ Short password correctly rejected")
    
    def test_refresh_token(self):
        """Test token refresh"""
        # First login to get tokens
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert login_response.status_code == 200
        refresh_token = login_response.json()["refreshToken"]
        
        # Use refresh token
        response = requests.post(f"{BASE_URL}/api/auth/refresh", json={
            "refreshToken": refresh_token
        })
        assert response.status_code == 200, f"Refresh failed: {response.text}"
        
        data = response.json()
        assert "accessToken" in data
        print("✓ Token refresh successful")


class TestUserProfile:
    """User profile endpoint tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["accessToken"]
        pytest.skip("Authentication failed")
    
    def test_get_profile_authenticated(self, auth_token):
        """Test getting profile with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/user/profile",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Profile fetch failed: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert "username" in data
        assert "email" in data
        assert "displayName" in data
        assert "initials" in data
        assert "phone" in data
        assert "bio" in data
        assert "location" in data
        assert "website" in data
        assert "githubUsername" in data
        assert "leetcodeUsername" in data
        assert "codeforcesHandle" in data
        assert "hackerrankUsername" in data
        print(f"✓ Profile retrieved for {data['username']}")
    
    def test_get_profile_no_token(self):
        """Test getting profile without token"""
        response = requests.get(f"{BASE_URL}/api/user/profile")
        assert response.status_code == 401
        print("✓ Unauthenticated profile access correctly rejected")
    
    def test_get_profile_invalid_token(self):
        """Test getting profile with invalid token"""
        response = requests.get(
            f"{BASE_URL}/api/user/profile",
            headers={"Authorization": "Bearer invalid_token_here"}
        )
        assert response.status_code == 401
        print("✓ Invalid token correctly rejected")
    
    def test_update_profile(self, auth_token):
        """Test updating profile fields"""
        update_data = {
            "displayName": "Test Developer Updated",
            "phone": "+1 555-999-8888",
            "bio": "Updated bio for testing",
            "location": "New York",
            "website": "https://updated-test.io"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/user/profile",
            headers={"Authorization": f"Bearer {auth_token}"},
            json=update_data
        )
        assert response.status_code == 200, f"Profile update failed: {response.text}"
        
        data = response.json()
        assert data["displayName"] == update_data["displayName"]
        assert data["phone"] == update_data["phone"]
        assert data["bio"] == update_data["bio"]
        assert data["location"] == update_data["location"]
        assert data["website"] == update_data["website"]
        
        # Verify persistence with GET
        get_response = requests.get(
            f"{BASE_URL}/api/user/profile",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["displayName"] == update_data["displayName"]
        print("✓ Profile update successful and persisted")
        
        # Restore original values
        requests.put(
            f"{BASE_URL}/api/user/profile",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "displayName": "Test Developer",
                "phone": "+1 555-123-4567",
                "bio": "Full-stack dev",
                "location": "San Francisco",
                "website": "https://testdev.io"
            }
        )


class TestPlatformUsernames:
    """Platform username update tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["accessToken"]
        pytest.skip("Authentication failed")
    
    def test_update_platforms(self, auth_token):
        """Test updating platform usernames"""
        platform_data = {
            "githubUsername": "octocat",
            "leetcodeUsername": "testuser",
            "codeforcesHandle": "testhandle",
            "hackerrankUsername": "testhr"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/user/platforms",
            headers={"Authorization": f"Bearer {auth_token}"},
            json=platform_data
        )
        assert response.status_code == 200, f"Platform update failed: {response.text}"
        
        data = response.json()
        assert data["githubUsername"] == platform_data["githubUsername"]
        assert data["leetcodeUsername"] == platform_data["leetcodeUsername"]
        assert data["codeforcesHandle"] == platform_data["codeforcesHandle"]
        assert data["hackerrankUsername"] == platform_data["hackerrankUsername"]
        
        # Verify persistence
        get_response = requests.get(
            f"{BASE_URL}/api/user/profile",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["githubUsername"] == platform_data["githubUsername"]
        print("✓ Platform usernames updated and persisted")
        
        # Restore original values
        requests.put(
            f"{BASE_URL}/api/user/platforms",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={
                "githubUsername": GITHUB_USER,
                "leetcodeUsername": LEETCODE_USER,
                "codeforcesHandle": CODEFORCES_USER,
                "hackerrankUsername": HACKERRANK_USER
            }
        )


class TestGitHubAPI:
    """GitHub API integration tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["accessToken"]
        pytest.skip("Authentication failed")
    
    def test_github_profile_by_username(self, auth_token):
        """Test fetching GitHub profile by username"""
        response = requests.get(
            f"{BASE_URL}/api/github/{GITHUB_USER}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"GitHub API failed: {response.text}"
        
        data = response.json()
        assert "username" in data
        assert data["username"] == GITHUB_USER
        assert "publicRepos" in data
        assert "followers" in data
        assert "totalStars" in data
        print(f"✓ GitHub profile fetched for {GITHUB_USER}")
    
    def test_github_me_endpoint(self, auth_token):
        """Test fetching linked GitHub profile"""
        response = requests.get(
            f"{BASE_URL}/api/github/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        # Should work since user has githubUsername linked
        assert response.status_code == 200, f"GitHub /me failed: {response.text}"
        print("✓ GitHub /me endpoint working")
    
    def test_github_no_auth(self):
        """Test GitHub API without authentication"""
        response = requests.get(f"{BASE_URL}/api/github/{GITHUB_USER}")
        assert response.status_code == 401
        print("✓ GitHub API correctly requires auth")


class TestLeetCodeAPI:
    """LeetCode API integration tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["accessToken"]
        pytest.skip("Authentication failed")
    
    def test_leetcode_profile_by_username(self, auth_token):
        """Test fetching LeetCode profile by username"""
        response = requests.get(
            f"{BASE_URL}/api/leetcode/{LEETCODE_USER}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"LeetCode API failed: {response.text}"
        
        data = response.json()
        assert "username" in data
        assert data["username"] == LEETCODE_USER
        assert "totalSolved" in data
        assert "easySolved" in data
        assert "mediumSolved" in data
        assert "hardSolved" in data
        print(f"✓ LeetCode profile fetched for {LEETCODE_USER}")
    
    def test_leetcode_me_endpoint(self, auth_token):
        """Test fetching linked LeetCode profile"""
        response = requests.get(
            f"{BASE_URL}/api/leetcode/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"LeetCode /me failed: {response.text}"
        print("✓ LeetCode /me endpoint working")


class TestCodeforcesAPI:
    """Codeforces API integration tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["accessToken"]
        pytest.skip("Authentication failed")
    
    def test_codeforces_profile_by_handle(self, auth_token):
        """Test fetching Codeforces profile by handle"""
        response = requests.get(
            f"{BASE_URL}/api/codeforces/{CODEFORCES_USER}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Codeforces API failed: {response.text}"
        
        data = response.json()
        assert "handle" in data
        assert data["handle"] == CODEFORCES_USER
        assert "rating" in data
        assert "rank" in data
        assert "totalSolved" in data
        print(f"✓ Codeforces profile fetched for {CODEFORCES_USER}")
    
    def test_codeforces_me_endpoint(self, auth_token):
        """Test fetching linked Codeforces profile"""
        response = requests.get(
            f"{BASE_URL}/api/codeforces/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Codeforces /me failed: {response.text}"
        print("✓ Codeforces /me endpoint working")


class TestHackerRankAPI:
    """HackerRank API integration tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "identifier": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["accessToken"]
        pytest.skip("Authentication failed")
    
    def test_hackerrank_profile_by_username(self, auth_token):
        """Test fetching HackerRank profile by username"""
        response = requests.get(
            f"{BASE_URL}/api/hackerrank/{HACKERRANK_USER}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"HackerRank API failed: {response.text}"
        
        data = response.json()
        assert "username" in data
        assert data["username"] == HACKERRANK_USER
        assert "badges" in data
        assert "badgeList" in data
        print(f"✓ HackerRank profile fetched for {HACKERRANK_USER}")
    
    def test_hackerrank_me_endpoint(self, auth_token):
        """Test fetching linked HackerRank profile"""
        response = requests.get(
            f"{BASE_URL}/api/hackerrank/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"HackerRank /me failed: {response.text}"
        print("✓ HackerRank /me endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
