<%--
  Created by IntelliJ IDEA.
  User: zubair
  Date: 09.12.16
  Time: 21:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Login</title>
</head>
<body>
<h1>Login</h1>

<h2>${failedMessage}</h2>

<form method="POST" action="/j_spring_security_check">
    <input type="text" name="j_username" value="" />
    <input  type="password" name="j_password" value="" />
    <input  type="submit" />

</form>
</body>
</html>
