package org.hisp.appstore;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by birkbj on 17/04/2017.
 */

@Controller
public class FrontendController {
    private static final Log log = LogFactory.getLog( FrontendController.class );

    @RequestMapping(value = "/")
    public String getIndex() {
        log.warn("Frontendcontroller");

        return "forward:/app/index.html";
    }
    /*
    @RequestMapping(value = "/user/*")
    public String getUser() {
        log.warn("Frontendcontroller");

        return "forward:/app/index.html";
    }

    @RequestMapping(value = "/app/*")
    public String getApp() {
        log.warn("Frontendcontroller");

        return "forward:/app/index.html";
    } */
}
