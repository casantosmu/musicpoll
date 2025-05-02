import Ajv, { type JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

export default class Validator {
    private readonly ajv = this.Ajv();
    private readonly validations = {
        voteReqBody: this.voteReqBody(),
        getPollReqParams: this.getPollReqParams(),
        createPollReqBody: this.createPollReqBody(),
        searchSongsReqQuery: this.searchSongsReqQuery(),
        getUserReqParams: this.getUserReqParams(),
    };

    get<K extends keyof typeof this.validations>(validation: K): (typeof this.validations)[K] {
        return this.validations[validation];
    }

    private Ajv() {
        const ajv = new Ajv.default({
            coerceTypes: true,
        });
        addFormats.default(ajv);
        return ajv;
    }

    private voteReqBody() {
        const schema: JSONSchemaType<
            {
                pollSongId: string;
                action: "add";
            }[]
        > = {
            type: "array",
            items: {
                type: "object",
                properties: {
                    pollSongId: {
                        type: "string",
                    },
                    action: {
                        type: "string",
                        enum: ["add"],
                    },
                },
                required: ["pollSongId", "action"],
                additionalProperties: false,
            },
        };

        return this.ajv.compile(schema);
    }

    private getPollReqParams() {
        const schema: JSONSchemaType<{ id: string }> = {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    format: "uuid",
                },
            },
            required: ["id"],
            additionalProperties: false,
        };

        return this.ajv.compile(schema);
    }

    private createPollReqBody() {
        const schema: JSONSchemaType<{
            title: string;
            description: string | null;
            allowMultipleOptions: boolean;
            songs: { id: string; title: string; artist: string; album: string; albumImg: string }[];
        }> = {
            type: "object",
            properties: {
                title: {
                    type: "string",
                },
                description: {
                    type: "string",
                    nullable: true,
                },
                allowMultipleOptions: {
                    type: "boolean",
                },
                songs: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                            },
                            title: {
                                type: "string",
                            },
                            artist: {
                                type: "string",
                            },
                            album: {
                                type: "string",
                            },
                            albumImg: {
                                type: "string",
                            },
                        },
                        required: ["id", "title", "artist", "album", "albumImg"],
                        additionalProperties: false,
                    },
                },
            },
            required: ["title", "description", "allowMultipleOptions", "songs"],
            additionalProperties: false,
        };

        return this.ajv.compile(schema);
    }

    private searchSongsReqQuery() {
        const schema: JSONSchemaType<{
            q: string;
            limit?: number;
            offset?: number;
        }> = {
            type: "object",
            properties: {
                q: {
                    type: "string",
                },
                limit: {
                    type: "integer",
                    minimum: 0,
                    maximum: 50,
                    nullable: true,
                },
                offset: {
                    type: "integer",
                    minimum: 0,
                    maximum: 1000,
                    nullable: true,
                },
            },
            required: ["q"],
            additionalProperties: false,
        };

        return this.ajv.compile(schema);
    }

    private getUserReqParams() {
        const schema: JSONSchemaType<{ id: string }> = {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    format: "uuid",
                },
            },
            required: ["id"],
            additionalProperties: false,
        };

        return this.ajv.compile(schema);
    }
}
