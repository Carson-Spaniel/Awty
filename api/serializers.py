from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Trip, Stop, Route

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ['id', 'trip', 'location', 'description', 'order']

    def create(self, validated_data):
        # Automatically set the trip field if not provided
        trip = validated_data.pop('trip', None)
        stop = Stop.objects.create(**validated_data)
        return stop

    def update(self, instance, validated_data):
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.order = validated_data.get('order', instance.order)
        instance.save()
        return instance

class TripSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, required=False)

    class Meta:
        model = Trip
        fields = ['id', 'user', 'name', 'description', 'start_location', 'end_location', 'created_at', 'stops']
        extra_kwargs = {
            'user': {'read_only': True},
        }

    def create(self, validated_data):
        stops_data = validated_data.pop('stops', [])
        trip = Trip.objects.create(**validated_data)
        for stop_data in stops_data:
            Stop.objects.create(trip=trip, **stop_data)
        return trip

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.start_location = validated_data.get('start_location', instance.start_location)
        instance.end_location = validated_data.get('end_location', instance.end_location)
        instance.save()

        # Handle updating stops
        stops_data = validated_data.get('stops', [])
        for stop_data in stops_data:
            stop_id = stop_data.get('id')
            if stop_id:  # Update existing stop
                stop_instance = Stop.objects.get(id=stop_id, trip=instance)
                stop_instance.location = stop_data.get('location', stop_instance.location)
                stop_instance.description = stop_data.get('description', stop_instance.description)
                stop_instance.order = stop_data.get('order', stop_instance.order)
                stop_instance.save()
            else:  # Create new stop
                Stop.objects.create(trip=instance, **stop_data)

        return instance

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'trip', 'route_data', 'updated_at']

    def create(self, validated_data):
        return Route.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.route_data = validated_data.get('route_data', instance.route_data)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user