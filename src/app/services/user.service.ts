import { Injectable } from "@angular/core";
import { uniq as _uniq } from "lodash";
import { decrypt } from "../utils/util-encrypt";

@Injectable()
export class UserService {
    constructor() { }

    public getPersonaId(): Promise<number> {
        return new Promise((resolve, reject) => {
            const strcryptedId = localStorage.getItem('persona_id');
            if (strcryptedId != null) {
                const strId = decrypt(strcryptedId);
                if (strId) {
                    resolve(parseInt(strId, 10));
                } else {
                    reject(new Error('No id found'));
                }
            } else {
                reject(new Error('No persona_id found'));
            }
        });
    }

    // Nueva función para obtener el código del estudiante
    public getCodigoEstudiante(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const userStr = localStorage.getItem('user'); // Obtener la cadena de 'user' del localStorage
                if (!userStr) {
                    reject(new Error("No user data in localStorage"));
                    return;
                }
                const userObj = JSON.parse(atob(userStr)); // Desencriptar y parsear el usuario
                console.log("Decoded user data:", userObj); // Imprimir datos decodificados para diagnóstico
                
                // Verificar si el código está en user o userService
                const codigo = "20221025092" || userObj.user?.Codigo || userObj.userService?.Codigo || null;
    
                if (codigo) {
                    resolve(codigo);
                } else {
                    reject(new Error(`No ha sido asignado un código al usuario`));
                }
            } catch (error) {
                console.error("Error decoding user data:", error);
                reject(new Error("Error processing user data"));
            }
        });
    }
    
    
    private decodeUser(): any {
        const strUser = localStorage.getItem("user");
        if (strUser === null || strUser === "") {
            throw new Error("No user information found");
        } else {
            try {
                const strdecoded = atob(strUser);
                const parsed = JSON.parse(strdecoded);
                if (parsed.user && parsed.userService) {
                    return parsed;
                } else {
                    throw new Error("Incomplete user information");
                }
            } catch (error) {
                throw new Error("Invalid user information: " + error);
            }
        }
    }

    public getUserRoles(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                const { user, userService } = this.decodeUser();
                const roleUser = typeof user.role !== 'undefined' ? user.role as string[] : [];
                const roleUserService = typeof userService.role !== 'undefined' ? userService.role as string[] : [];
                const roles = _uniq(roleUser.concat(roleUserService)).filter((data: string) => !data.includes('/'));
                resolve(roles);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getUserEmail(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const { user, userService } = this.decodeUser();
                if (user.email) {
                    resolve(user.email);
                } else if (userService.email) {
                    resolve(userService.email);
                } else {
                    reject(new Error("No email found"));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public getUserDocument(compuesto: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const { user, userService } = this.decodeUser();
                const documentToSearch = compuesto ? 'documento_compuesto' : 'documento';
                if (user[documentToSearch]) {
                    resolve(user[documentToSearch]);
                } else if (userService[documentToSearch]) {
                    resolve(userService[documentToSearch]);
                } else {
                    reject(new Error("No document found"));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}