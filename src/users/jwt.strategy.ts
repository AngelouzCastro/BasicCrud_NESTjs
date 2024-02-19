import { Injectable,  UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstans } from "./jwt.constans";
import { UsersService } from "./users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userServie: UsersService) {
        super({
            //va a extrare el token desde el encabezado automaticamente
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            //haga uso de la misma( sirve para verificar que el token se gener desde mi propo backend)
            secretOrKey: jwtConstans.secrets,
        })
    }

    //desencipta el token para saber quien esta usando la aplicacion
    async validate(payload: any) {
        const user = await this.userServie.getUser(payload.sub)
        if (!user) {
            throw new UnauthorizedException()
        }
        return  {userId: payload.id, username: payload.username}
        // return user
    }
}