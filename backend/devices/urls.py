from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet

router = DefaultRouter()
router.register('', DeviceViewSet)

urlpatterns = router.urls 