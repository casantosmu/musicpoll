import pg from "pg";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type Logger from "@/Logger.js";

export interface Pagination {
    limit?: number;
    offset?: number;
}

export default abstract class Repository<Entity> {
    private readonly logger: Logger;
    private readonly pool: pg.Pool;
    protected tableName: string;

    protected constructor(tableName: string, logger: Logger, pool: pg.Pool) {
        this.tableName = tableName;
        this.logger = logger.child({ name: this.constructor.name });
        this.pool = pool;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected async query<Row extends pg.QueryResultRow = any>(text: string, params?: unknown[]) {
        const start = Date.now();
        try {
            const result = await this.pool.query<Row>(text, params);
            const duration = Date.now() - start;
            this.logger.debug("Executed query", { text, duration, rows: result.rowCount });
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            this.logger.error("Error executing query", { error, text, duration });
            throw error;
        }
    }

    async findById(id: string) {
        const sql = `SELECT * FROM "${this.tableName}" WHERE id = $1;`;
        const result = await this.query(sql, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return camelcaseKeys(result.rows[0]) as Entity;
    }

    async exists(id: string) {
        const sql = `SELECT EXISTS(SELECT 1 FROM "${this.tableName}" WHERE id = $1);`;
        const result = await this.query(sql, [id]);
        return (result.rows[0] as { exists: boolean }).exists;
    }

    async save(props: Entity) {
        const columns: string[] = [];
        const placeholders: string[] = [];
        const values: unknown[] = [];

        // @ts-expect-error snakecaseKeys expects Record<string, unknown>
        Object.entries(snakecaseKeys(props)).forEach(([key, value], i) => {
            columns.push(`"${key}"`);
            placeholders.push(`$${i + 1}`);
            values.push(value);
        });

        const sql = `
            INSERT INTO ${this.tableName} (${columns.join(", ")})
            VALUES (${placeholders.join(", ")})
        ;`;

        await this.query(sql, values);
    }

    async bulkSave(entities: Entity[]) {
        if (!entities[0]) {
            this.logger.debug("bulkSave called with empty array, skipping.");
            return;
        }

        const columns = Object.keys(snakecaseKeys(entities[0])).map((key) => `"${key}"`);
        const placeholders: string[] = [];
        const values: unknown[] = [];
        let placeholderIndex = 1;

        entities.forEach((entity) => {
            const rowPlaceholders: string[] = [];

            // @ts-expect-error expects Record<string, unknown>
            Object.values(entity).forEach((value) => {
                values.push(value);
                rowPlaceholders.push(`$${placeholderIndex++}`);
            });

            placeholders.push(`(${rowPlaceholders.join(", ")})`);
        });

        const sql = `
            INSERT INTO "${this.tableName}" (${columns.join(", ")})
            VALUES ${placeholders.join(", ")}
        ;`;

        await this.query(sql, values);
    }

    async update(id: string, props: Partial<Entity>) {
        const updates: string[] = [];
        const values: unknown[] = [];

        Object.entries(snakecaseKeys(props)).forEach(([key, value], i) => {
            updates.push(`"${key}" = $${i + 1}`);
            values.push(value);
        });
        values.push(id);

        const sql = `
            UPDATE "${this.tableName}"
            SET ${updates.join(", ")}
            WHERE id = $${values.length}
        ;`;

        const result = await this.query(sql, values);
        return result.rowCount ? result.rowCount > 0 : false;
    }
}
