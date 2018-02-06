import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { CodePush, InstallMode, SyncStatus, DownloadProgress } from '@ionic-native/code-push';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class AppUpdateService {

  constructor(private codePush: CodePush,
    private localNotifications: LocalNotifications) {
  }

  checkForUpdate() {
    const notificationObject = {
      id: 1,
      title: "Baruch",
      text: "",
      vibrate: false,
      sound: null,
      icon: "/assets/icon/favicon.ico"
    };

    const downloadProgress = (progress: DownloadProgress) => {
      const received = AppUpdateService.humanFileSize(progress.receivedBytes, false);
      const total = AppUpdateService.humanFileSize(progress.totalBytes, false);
      notificationObject.text = `Downloaded ${received} of ${total}`;
      notificationObject["progressBar"] = { value: Math.ceil((progress.receivedBytes / progress.totalBytes) * 100) };
      this.localNotifications.update(notificationObject);
    };

    this.codePush
      .sync({
        updateDialog: {
          updateTitle: "An update is available",
          optionalUpdateMessage: "Change log:\n\n",
          optionalIgnoreButtonLabel: "Not now",
          optionalInstallButtonLabel: "Install",
          appendReleaseDescription: true,
          descriptionPrefix: ""
        },
        installMode: InstallMode.IMMEDIATE
      }, downloadProgress)
      .catch((err) => {
        return [];
      })
      .subscribe((syncStatus) => {
        switch (syncStatus) {
          case SyncStatus.CHECKING_FOR_UPDATE:
            notificationObject.text = "Checking for updates..."
            this.localNotifications.schedule(notificationObject);
            break;
          case SyncStatus.INSTALLING_UPDATE:
            notificationObject.text = "Installing update...";
            notificationObject["progressBar"] = { value: 100 };
            this.localNotifications.update(notificationObject);
            break;
          case SyncStatus.UP_TO_DATE:
          case SyncStatus.ERROR:
          case SyncStatus.UPDATE_IGNORED:
          case SyncStatus.UPDATE_INSTALLED:
            this.localNotifications.cancel(notificationObject.id);
            break;
        }
      });
  }

  // From https://stackoverflow.com/a/14919494/5866781
  static humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    var units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }
}
