import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(gbox: string, password: string) {
    const [rows] = (await this.db
      .getPool()
      .execute('SELECT * FROM users WHERE gbox = ?', [gbox])) as any[];

    if (rows.length === 0) {
      throw new BadRequestException('wrong password or gbox');
    }

    const user = rows[0];
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('wrong password or gbox');
    }

    const payload = { userId: user.id, gbox: user.gbox };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    const hashedRT = await bcrypt.hash(refreshToken, 10);
    await this.db
      .getPool()
      .execute('UPDATE users SET refreshToken = ? WHERE id = ?', [
        hashedRT,
        user.id,
      ]);
    return { accessToken, refreshToken };
  }

  async signup(gbox: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(gbox, password);
    await this.db
      .getPool()
      .execute('INSERT INTO users (gbox, password) VALUES(?, ?)', [
        gbox,
        hashedPassword,
      ]);

    return {
      message: 'created ok',
      data: { gbox, hashedPassword },
    };
  }

  
}
