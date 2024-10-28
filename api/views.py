from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Trip, Stop, Route
from .serializers import TripSerializer, StopSerializer, RouteSerializer
from .utils import calculate_route  # Assume this calls OSRM to get the route data

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return trips for the logged-in user."""
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def stops(self, request, pk=None):
        trip = self.get_object()
        stops = trip.stops.order_by('order')
        serializer = StopSerializer(stops, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_stop(self, request, pk=None):
        trip = self.get_object()
        serializer = StopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(trip=trip)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def route(self, request, pk=None):
        trip = self.get_object()
        route, created = Route.objects.get_or_create(trip=trip)
        if not route.route_data or 'recalculate' in request.query_params:
            route_data = calculate_route(trip)
            route.route_data = route_data
            route.save()
        serializer = RouteSerializer(route)
        return Response(serializer.data)

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class RouteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer


