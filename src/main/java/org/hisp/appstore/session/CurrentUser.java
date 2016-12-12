package org.hisp.appstore.session;

import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;


/**
 * Created by zubair on 10.12.16.
 */
@AuthenticationPrincipal
public @interface CurrentUser
{
}
