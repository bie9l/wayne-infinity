import { securityService } from './security';
import { store } from '../store';

class SecurityLogger {
  static getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  }

  static async log(eventType, description, ipAddress, location = null) {
    try {
      const user = this.getCurrentUser();
      const logData = {
        event_type: eventType,
        description,
        user: user ? user.email : 'Sistema',
        ip_address: ipAddress
      };

      if (location && location.trim() !== '') {
        logData.location = location.trim();
      }

      console.log('Criando log com dados:', logData);
      await securityService.createLog(logData);
    } catch (error) {
      console.error('Erro ao criar log de segurança:', error);
      throw error;
    }
  }

  static async logLogin(ipAddress) {
    await this.log(
      'access',
      'Login realizado com sucesso',
      ipAddress
    );
  }

  static async logLogout(ipAddress) {
    await this.log(
      'access',
      'Logout realizado',
      ipAddress
    );
  }

  static async logIncidentCreated(incident, ipAddress) {
    await this.log(
      'alert',
      `Novo incidente criado: ${incident.title}`,
      ipAddress,
      incident.location
    );
  }

  static async logIncidentUpdated(incident, ipAddress) {
    await this.log(
      'alert',
      `Incidente atualizado: ${incident.title}`,
      ipAddress,
      incident.location
    );
  }

  static async logIncidentDeleted(incidentId, ipAddress) {
    await this.log(
      'alert',
      `Incidente excluído: ID ${incidentId}`,
      ipAddress
    );
  }

  static async logDeviceCreated(device, ipAddress) {
    await this.log(
      'system',
      `Novo dispositivo criado: ${device.name}`,
      ipAddress,
      device.location
    );
  }

  static async logDeviceUpdated(device, ipAddress) {
    await this.log(
      'system',
      `Dispositivo atualizado: ${device.name}`,
      ipAddress,
      device.location
    );
  }

  static async logDeviceDeleted(deviceId, ipAddress) {
    await this.log(
      'system',
      `Dispositivo excluído: ID ${deviceId}`,
      ipAddress
    );
  }

  static async logEquipmentCreated(equipment, ipAddress) {
    await this.log(
      'system',
      `Novo equipamento criado: ${equipment.name}`,
      ipAddress,
      equipment.location
    );
  }

  static async logEquipmentUpdated(equipment, ipAddress) {
    await this.log(
      'system',
      `Equipamento atualizado: ${equipment.name}`,
      ipAddress,
      equipment.location
    );
  }

  static async logEquipmentDeleted(equipmentId, ipAddress) {
    await this.log(
      'system',
      `Equipamento excluído: ID ${equipmentId}`,
      ipAddress
    );
  }

  static async logVehicleCreated(vehicle, ipAddress) {
    await this.log(
      'system',
      `Novo veículo criado: ${vehicle.name}`,
      ipAddress,
      vehicle.location
    );
  }

  static async logVehicleUpdated(vehicle, ipAddress) {
    await this.log(
      'system',
      `Veículo atualizado: ${vehicle.name}`,
      ipAddress,
      vehicle.location
    );
  }

  static async logVehicleDeleted(vehicleId, ipAddress) {
    await this.log(
      'system',
      `Veículo excluído: ID ${vehicleId}`,
      ipAddress
    );
  }

  static async logViolation(description, ipAddress, location = null) {
    await this.log(
      'violation',
      description,
      ipAddress,
      location
    );
  }
}

export default SecurityLogger; 