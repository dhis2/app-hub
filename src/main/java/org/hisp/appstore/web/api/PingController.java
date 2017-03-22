package org.hisp.appstore.web.api;

import org.hisp.appstore.api.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Component
@RequestMapping ( value = "/api/apps" )
public class PingController
{
	@Autowired
	private CurrentUserService currentUserService;

	@RequestMapping(value = "/ping")
	@ResponseBody
	public String ping() {
		return "All good. You DO NOT need to be authenticated to call /ping";
	}

    @RequestMapping(value = "/pong")
    @ResponseBody
    public String pong() {
        return "All good. You DO NOT need to be authenticated to call /pong";
    }

	@PreAuthorize( "hasRole('ROLE_MANAGER')" )
	@RequestMapping(value = "/secured/ping")
	@ResponseBody
	public String securedPing() {

		System.out.println( "user details " + currentUserService.getCurrentUserId() );
		return "All good. You DO need to be authenticated to call /secured/ping";
	}

	@PreAuthorize( "hasRole('ROLE_MANAGER')" )
	@RequestMapping(value = "/secured/pong")
	@ResponseBody
	public String securedApiv1Ping() {
		return "All good. You DO need to be authenticated to call /secured/pong";
	}
}
