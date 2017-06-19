package org.hisp.appstore;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by birkbj on 17/04/2017.
 */
@Controller
public class FrontendController {
    private static final Log log = LogFactory.getLog( FrontendController.class );

   // @RequestMapping("/{path:[^\\.]+}/**")
    @RequestMapping(value= {"/app", "/app/*", "/user", "/user/*"})
    public String getIndex() {

        return "forward:/";
    }

    @ExceptionHandler(value = {Exception.class})
    public String forwardToIndex() {
        log.warn("Exceptionhandler");
        return "forward:/";
    }
}
