import { exec } from 'child_process';

class GmsaasController {
 

  runCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command.join(' '), (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr || error}`);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  async createInstance(recipe, name) {
    return this.runCommand(['gmsaas', 'instances', 'create', recipe, name]);
  }

  async startInstance(uuid) {
    return this.runCommand(['gmsaas', 'instances', 'start', uuid]);
  }

  async stopInstance(uuid) {
    return this.runCommand(['gmsaas', 'instances', 'stop', uuid]);
  }

  async connectInstance(uuid) {
    return this.runCommand(['gmsaas', 'instances', 'adbconnect', uuid]);
  }

  async runAdbCommand(uuid, adbCommand) {
    await this.connectInstance(uuid);
    return this.runCommand(['adb', '-s', uuid, ...adbCommand]);
  }

  async saveInstance(uuid, tag_name) {
    return this.runCommand(['gmsaas', 'instances', 'stop', uuid, '--tag', tag_name]);
  }


}

export default GmsaasController;
