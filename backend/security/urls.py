from rest_framework.routers import DefaultRouter
from .views import SecurityIncidentViewSet, SecurityLogViewSet

router = DefaultRouter()
router.register('incidents', SecurityIncidentViewSet)
router.register('logs', SecurityLogViewSet)

urlpatterns = router.urls 