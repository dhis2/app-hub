package org.hisp.appstore.Configuration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

/**
 * Created by zubair on 19.01.17.
 */
@SpringBootApplication
@ComponentScan(basePackages = {"org.hisp.appstore", "com.auth0.spring.security.mvc"})
@PropertySource("classpath:application.properties")
@ImportResource("classpath:/META-INF/beans.xml")
public class Dhis2AppStore
{
    public static void main(String[] args) {
        SpringApplication.run( Dhis2AppStore.class, args );
    }
}
