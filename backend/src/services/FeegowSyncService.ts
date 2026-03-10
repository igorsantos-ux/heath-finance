import prisma from '../lib/prisma.js';
import { FeegowService } from './FeegowService.js';

export class FeegowSyncService {
    static async syncAll(clinicId: string) {
        const integration = await prisma.integration.findUnique({
            where: { clinicId_type: { clinicId, type: 'FEEGOW' } }
        });

        if (!integration || !integration.isActive || !integration.token) {
            throw new Error('Integração Feegow não configurada ou inativa.');
        }

        const settings = integration.settings as any;
        const modules = settings?.modules || {};
        const results: any = {};

        if (modules.patients) {
            results.patients = await this.syncPatients(clinicId, integration.token);
        }

        if (modules.appointments) {
            // results.appointments = await this.syncAppointments(clinicId, integration.token);
            results.appointments = { message: 'Módulo de agendamentos em desenvolvimento' };
        }

        return results;
    }

    private static async syncPatients(clinicId: string, token: string) {
        try {
            const data = await FeegowService.getPatients(token);
            const patients = data?.content || [];

            let createdCount = 0;
            let updatedCount = 0;

            for (const patient of patients) {
                // Mapeamento usando externalId e externalSource
                await prisma.customer.upsert({
                    where: {
                        externalId_externalSource_clinicId: {
                            externalId: patient.id.toString(),
                            externalSource: 'FEEGOW',
                            clinicId
                        }
                    },
                    update: {
                        name: patient.nome,
                        email: patient.email,
                        phone: patient.telefone,
                        birthDate: patient.data_nascimento ? new Date(patient.data_nascimento) : undefined,
                    },
                    create: {
                        name: patient.nome,
                        email: patient.email,
                        phone: patient.telefone,
                        birthDate: patient.data_nascimento ? new Date(patient.data_nascimento) : undefined,
                        externalId: patient.id.toString(),
                        externalSource: 'FEEGOW',
                        clinicId
                    }
                });
                createdCount++;
            }

            return { success: true, count: patients.length, created: createdCount, updated: updatedCount };
        } catch (error: any) {
            console.error('Erro na sincronização de pacientes:', error);
            return { success: false, error: error.message };
        }
    }
}
