package org.hisp.appstore.web.api;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.domain.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by zubair on 13.12.16.
 */
@Controller
@RequestMapping ( value = "/api/users" )
public class UserController extends AbstractCrudController<User>
{
}
