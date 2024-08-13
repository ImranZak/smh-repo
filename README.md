# smh-repo
Useful Postman commands to popular users and staff
http://localhost:3001/staff/populate
http://localhost:3001/api/user/populate
Password for user is Password1
Password for staff is SMHStaff2024

Commands for running the project:
npm install on client and server.
npm audit --omit=dev on client side because react scripts will always have vulnerability in in release versions
npm audit fix on server to change the axios version to mederate vulnerability (introduced recently because of axios version)


Community Dashboard Feature(Imran)
Friends Management:

View, search, add, and manage friends.
You can't add yourself as a friend; an error message will show if you try.
Dashboard:

Add, save, and clear graphs for energy and water usage.
Customize the layout, which is saved per user.
Messaging:

Search for friends to message.
Send messages and refresh your inbox.
Error Handling:

Clear error messages when issues occur, like adding yourself as a friend or searching for non-existent users.

