import { Test, TestingModule } from '@nestjs/testing';
import { HistoriasClinicasController } from './historias-clinicas.controller';

describe('HistoriasClinicasController', () => {
  let controller: HistoriasClinicasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriasClinicasController],
    }).compile();

    controller = module.get<HistoriasClinicasController>(HistoriasClinicasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
