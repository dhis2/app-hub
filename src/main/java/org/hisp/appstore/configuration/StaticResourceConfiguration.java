package org.hisp.appstore.configuration;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.resource.PathResourceResolver;


@Configuration
public class StaticResourceConfiguration extends WebMvcConfigurerAdapter {
   // classpath:/META-INF/resources/app/

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (!registry.hasMappingForPattern("/js/**")) {
         //   registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
         //   registry.addResourceHandler("/js/**").addResourceLocations("classpath:/app/");
        }
        if (!registry.hasMappingForPattern("/**")) {

            registry.addResourceHandler("/**").addResourceLocations("classpath:/app/");
        }
    } /*
    @Bean
    public WebMvcConfigurerAdapter forwardToIndex() {
        return new WebMvcConfigurerAdapter() {


            private final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/public/" };

          /*  @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                registry.addViewController("/").setViewName(
                        "forward:/app/index.html");
            }
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                super.addResourceHandlers(registry);
                if (!registry.hasMappingForPattern("/app/**")) {
                    registry.addResourceHandler("/app/**").addResourceLocations("classpath:/META-INF/resources/app/");
                }
                if (!registry.hasMappingForPattern("/**")) {
                    registry.addResourceHandler("/**").addResourceLocations("classpath:/META-INF/resources/app/");
                }
            }
        };
    } */

}
