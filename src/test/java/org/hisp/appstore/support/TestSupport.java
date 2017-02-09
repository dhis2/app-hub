package org.hisp.appstore.support;

import org.hisp.appstore.configuration.Dhis2AppStore;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by zubair on 09.02.17.
 */
@RunWith( SpringRunner.class )
@SpringBootTest( classes = Dhis2AppStore.class )
@Transactional
public class TestSupport
{
}
