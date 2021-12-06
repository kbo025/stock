import {Injectable} from '@angular/core';
import {Keybinds} from 'common/core/keybinds/keybinds.service';
import {ActiveObjectService} from './active-object/active-object.service';
import {CanvasStateService} from './canvas-state.service';
import {take} from 'rxjs/operators';
import {HistoryToolService} from '../history/history-tool.service';

@Injectable()
export class CanvasKeybindsService {
    constructor(
        private state: CanvasStateService,
        private keybinds: Keybinds,
        private canvasState: CanvasStateService,
        private activeObject: ActiveObjectService,
        private history: HistoryToolService,
    ) {}

    init() {
        this.state.loaded
          .pipe(take(1))
          .subscribe(() => {
            this.keybinds.listenOn(this.canvasState.rootEl);

              this.keybinds.addWithPreventDefault('ctrl+z', () => {
                  this.history.undo();
              });

              this.keybinds.addWithPreventDefault('ctrl+shift+z', () => {
                  this.history.redo();
              });

            this.keybinds.addWithPreventDefault('arrow_up', () => {
                this.activeObject.move('top', -1);
            });

            this.keybinds.addWithPreventDefault('arrow_right', () => {
                this.activeObject.move('left', 1);
            });

            this.keybinds.addWithPreventDefault('arrow_down', () => {
                this.activeObject.move('top', 1);
            });

            this.keybinds.addWithPreventDefault('arrow_left', () => {
                this.activeObject.move('left', -1);
            });

            this.keybinds.addWithPreventDefault('delete', () => {
                const obj = this.activeObject.get();
                if ( ! obj) return;
                this.activeObject.delete();
                this.history.add({name: `Deleted: ${obj.name}`, icon: 'delete-custom'});
            });
        });
    }
}
