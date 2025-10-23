import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}
  async create(role_code: string, role_name: string, userId: string) {
    console.log(role_code, role_name, userId);
    await this.db
      .getPool()
      .execute(
        'INSERT INTO positions (role_code, role_name, userId) VALUES (?, ?, ?)',
        [role_code, role_name, userId],
      );

    return {
      messsage: 'role created',
      data: { role_code, role_name, userId },
    };
  }

  async findAll() {
    const [rows] = await this.db.getPool().execute('SELECT * FROM positions');

    const data = rows as any[];

    return data;
  }

  async findOne(id: number) {
    const [row] = await this.db
      .getPool()
      .execute('SELECT * FROM positions WHERE id = ?', [id]);

    const task = (row as any[])[0];

    return task;
  }

  async update(
    id: number,
    role_code: string,
    role_name: string,
    userId: number,
  ) {
    const [result] = await this.db
      .getPool()
      .execute(
        'UPDATE positions SET role_code = ?, role_name = ? WHERE id = ? AND userId = ?',
        [role_code, role_name, id, userId],
      );

    const affectedRows = (result as any).affectedRows;

    return {
      message: 'role updated successfully',
      data: {
        role_code: role_code,
        role_ame: role_name,
        userId: userId,
      },
      affectedRows,
    };
  }

  async remove(id: number) {
    const query = await this.db
      .getPool()
      .execute('DELETE FROM positions WHERE id = ?', [id]);

    const { affectedRows } = query as any;

    return { message: 'role Deleted', data: affectedRows };
  }
}
