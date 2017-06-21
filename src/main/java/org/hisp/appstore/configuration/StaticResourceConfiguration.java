package org.hisp.appstore.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@Configuration
public class StaticResourceConfiguration extends WebMvcConfigurerAdapter
{
    @Override
    public void addResourceHandlers( ResourceHandlerRegistry registry )
    {
        if ( !registry.hasMappingForPattern( "/js/**" ) )
        {
         //   registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
         //   registry.addResourceHandler("/js/**").addResourceLocations("classpath:/app/");
        }
        if ( !registry.hasMappingForPattern( "/**" ) )
        {

           // registry.addResourceHandler("/**").addResourceLocations("classpath:/app/");
        }
    }
}
