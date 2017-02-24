package org.hisp.appstore.web.api;

import org.hisp.appstore.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by zubair on 24.02.17.
 */
@RestController
@RequestMapping( value = "/api/versions" )
public class VersionController
{
    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private AppStoreService appStoreService;

    @Autowired
    private AppVersionService appVersionService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private RenderService renderService;

    @Autowired
    private UserService userService;

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    // POST
    // -------------------------------------------------------------------------
}
