from django.conf.urls import patterns, include, url
from rest_framework.authtoken import views as rest_views
import views
import get_auth_token

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LocationTracking.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^get-auth-token/', get_auth_token.get_auth_token),
    url(r'^post$', views.post),
)
