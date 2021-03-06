import {Injectable, NgZone} from '@angular/core';
import {Object} from 'fabric/fabric-impl';
import {CanvasService} from '../canvas/canvas.service';
import {ActiveObjectService} from '../canvas/active-object/active-object.service';
import {Store} from '@ngxs/store';
import {ObjectsSynced} from '../state/editor-state-actions';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ObjectListService {
    public objects$ = new BehaviorSubject<Object[]>([]);

    constructor(
        private canvas: CanvasService,
        private activeObject: ActiveObjectService,
        private store: Store,
        private zone: NgZone,
    ) {
        this.init();
    }

    /**
     * Get all objects that are currently on canvas.
     */
    public getAll() {
        return this.objects$.value;
    }

    /**
     * Get object with specified name from canvas.
     */
    public get(name: string) {
        return this.getAll().find(obj => obj.name === name);
    }

    /**
     * Get object with specified id from canvas.
     */
    public getById(id: string) {
        return this.getAll().find(obj => obj.data.id === id);
    }

    /**
     * Check whether specified object is currently selected.
     */
    public isActive(objectOrId: Object|string): boolean {
        const objId = typeof objectOrId === 'string' ? objectOrId : objectOrId.data.id;
        return this.activeObject.getId() === objId;
    }

    /**
     * Check if object with specified name exists on canvas.
     */
    public has(name: string) {
        return this.getAll().findIndex(obj => obj.name === name) > -1;
    }

    /**
     * Select specified object.
     */
    public select(object: Object) {
        this.canvas.state.fabric.setActiveObject(object);
        this.canvas.state.fabric.requestRenderAll();
    }

    /**
     * Sync layers list with fabric.js objects.
     * @hidden
     */
    public syncObjects() {
        const newObjects = this.canvas.fabric().getObjects()
            .filter(obj => !obj?.data?.pixieInternal).reverse();
        this.objects$.next(newObjects);
        this.store.dispatch(new ObjectsSynced());
    }

    /**
     * @hidden
     */
    public init() {
        this.canvas.state.loaded.subscribe(() => {
            this.syncObjects();

            this.canvas.state.on('object:added', () => {
                this.zone.run(() => this.syncObjects());
            });

            this.canvas.state.on('object:removed', () => {
                this.zone.run(() => this.syncObjects());
            });
        });
    }
}
