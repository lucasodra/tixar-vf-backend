# Club Management API Usage Guide
Welcome to the Club Management API! This guide will help you understand how to interact with the API to create, manage, and join clubs, redeem codes, and handle user profiles.

## API Base URL
Before you start, make sure you know the base URL of the API. You'll use this URL to access the API endpoints.

Base URL: https://localhost:3000/api

## Authentication
You might need to log in or provide some form of authentication to use certain endpoints, like creating or updating clubs and codes. Check with the API documentation or your administrator for authentication requirements.

## Club Endpoints
### Creating a Club
To create a new club, make a POST request to `/clubs`. You'll need to send a JSON object in the request body with the club's details.

Example Request Body:

```
json
Copy code
{
    "name": "My Awesome Club",
    "description": "A place for enthusiasts!"
}
```
Admin Type Required: Yes

### Getting All Clubs
To get a list of all clubs, simply make a GET request to `/clubs`.

Admin Type Required: No

### Getting a Club by ID
To fetch information about a specific club, send a GET request to `/clubs/:id`, where :id is the club's unique identifier.

Admin Type Required: No

### Updating a Club
If you need to modify a club's information, use a PUT request to `/clubs/:id`, where :id is the club's unique identifier. Include the updated club details in the request body.

Example Request Body:
```
json
Copy code
{
    "name": "Updated Club Name",
    "description": "New description for the club"
}
```
Admin Type Required: Yes

### Deleting a Club
To remove a club, send a DELETE request to `/clubs/:id`, where :id is the club's unique identifier.

Admin Type Required: Yes

### Joining a Club
To join a club, make a POST request to `/clubs/:clubId/join`, where :clubId is the club's unique identifier. You don't need to send a request body for this; the API will handle it.

Admin Type Required: No

## Profile Endpoints
### Getting Profiles by User (Fan)
To retrieve profiles associated with a user (fan), send a GET request to `/profiles`. The API will return a list of profiles linked to the logged-in user.

Admin Type Required: No

### Redeeming a Code
To redeem a code and earn points, send a POST request to `/profiles/redeem-code`. Include the code you want to redeem in the request body.

Example Request Body:
```
json
Copy code
{
    "code": "ABC123"
}
```
Admin Type Required: No

## Code Endpoints
### Creating a Code
To create a new code, make a POST request to `/codes`. You'll need to provide code details in the request body. Note that creating codes might require special permissions.

Example Request Body:

```
json
Copy code
{
    "code": "NEWCODE123",
    "value": 50
}
```

Admin Type Required: Yes

### Getting All Codes
To retrieve a list of all codes, send a GET request to `/codes`. Access to this endpoint may be restricted to certain users, like administrators.

Admin Type Required: Yes

### Updating a Code
To update a code's details, use a PUT request to `/codes/:id`, where :id is the code's unique identifier. Include the updated code information in the request body.

Example Request Body:

```
json
Copy code
{
    "value": 100
}
```

Admin Type Required: Yes

### Deleting a Code
To delete a code, send a DELETE request to `/codes/:id`, where :id is the code's unique identifier. You may need special permissions to perform this action.

Admin Type Required: Yes

## Fan Endpoints
### Getting All Fans
To get a list of all fans, send a GET request to `/fans`. Access to this endpoint may be restricted to certain users, like administrators.

Admin Type Required: Yes

### Getting a Fan by ID
To fetch information about a specific fan, send a GET request to `/fans/:id`, where :id is the fan's unique identifier. Special permissions may be required.

Admin Type Required: Yes

### Getting Your Own Fan Profile
To retrieve your own fan profile, send a GET request to `/fans/myself`. The API will return information about your fan profile.

Admin Type Required: No