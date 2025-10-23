import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
  async getAll() {
    const [rows] = await this.db.getPool().execute('SELECT * FROM users');
    const data = rows as any[];
    if (data.length === 0) {
      throw new BadRequestException('No Data found');
    }

    return data;
  }

  async getOne(id: number) {
    const [rows] = await this.db
      .getPool()
      .execute('SELECT * FROM users WHERE id = ?', [id]);
    const data = rows as any[];
    if (data.length === 0) {
      throw new BadRequestException('no datas found');
    }

    return data;
  }

  async delete(id: number) {
    const [rows] = await this.db
      .getPool()
      .execute('DELETE FROM users WHERE id = ?', [id]);

    const { affectedRows } = rows as any;

    if (affectedRows === 0) {
      throw new BadRequestException('the user not found or not exist');
    }

    return { message: 'deleted user done' };
  }

  async update(id: string, gbox: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await this.db
      .getPool()
      .execute('UPDATE users SET gbox = ?, password = ? WHERE id = ? ', [
        gbox,
        hashedPassword,
        id,
      ]);

    const { affectedRows } = rows as any;

    if (affectedRows === 0) {
      throw new BadRequestException('the user cannot be found');
    }

    return {
      message: 'the account is successfully updated',
      data: { gbox, hashedPassword },
    };
  }
}
