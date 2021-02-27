import { ExtensionContext, Webview, WebviewView, WebviewViewProvider } from 'vscode';
import WebviewAction, { WebviewActionEnum } from '@src/core/types/webview-action';
import configureWebview from '../utils/configure-webview';

import { RemoteSession } from '../remote-session';
import { deliverRemoteSessionMessage } from '../utils/action-handler';

export class ControlPanelView implements WebviewViewProvider {
  private readonly _extensionContext: ExtensionContext;
  private readonly _actionHanlder: (action: WebviewAction) => void | Promise<void>;
  private _remoteSession: RemoteSession;
  private webview?: Webview;

  constructor(
    extensionContext: ExtensionContext,
    actionHanlder: (action: WebviewAction) => void | Promise<void>,
  ) {
    this._extensionContext = extensionContext;
    this._actionHanlder = actionHanlder;
    this._remoteSession = new RemoteSession(extensionContext);
  }

  private handleAction = (action: WebviewAction) => {
    // TO-DO: refactor
    if (action.action === WebviewActionEnum.ConnectToRemoteSession) {
      this._remoteSession.connectTo(action.payload, (payload) =>
        deliverRemoteSessionMessage(this.webview, payload),
      );
      return;
    }

    if (action.action === WebviewActionEnum.ActivateTerminal) {
      this._remoteSession.activateTerminalIfNeeded();
      return;
    }

    this._actionHanlder(action);
  };

  resolveWebviewView(webviewView: WebviewView): void {
    const webview = webviewView.webview;

    configureWebview(
      this._extensionContext,
      webview,
      'control-panel',
      'GitHub VSC Control Panel',
      this.handleAction,
      this._extensionContext.subscriptions,
    );

    this.webview = webview;
  }

  getWebview(): Optional<Webview> {
    return this.webview;
  }
}
