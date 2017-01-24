<%--
  Created by IntelliJ IDEA.
  User: zubair
  Date: 20.01.17
  Time: 01:39
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>User Page</title>
</head>
<body>
<h1>User Page</h1>
<form name="fileUploadForm" action="/upload" method="post" enctype="multipart/form-data">
    <label>Select file</label>
    <input type="file" name="uploadedFile" id="uploadedFile" />

    <input type="submit" value="Upload" />

</form>
<a href="/logout">Logout</a>
<h2>User is ${user.username}</h2>
<h2>User is ${user.firstName}</h2>
</body>
</html>