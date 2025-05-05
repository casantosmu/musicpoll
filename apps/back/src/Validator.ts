import Ajv, { type JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

export default class Validator {
    private readonly ajv = this.Ajv();
    private readonly validations = {
        voteReqBody: this.ajv.compile(this.voteReqBody()),
        getPollReqParams: this.ajv.compile(this.getPollReqParams()),
        createPollReqBody: this.ajv.compile(this.createPollReqBody()),
        searchSongsReqQuery: this.ajv.compile(this.searchSongsReqQuery()),
        getUserReqParams: this.ajv.compile(this.getUserReqParams()),
        getPollResultReqParams: this.ajv.compile(this.getPollResultReqParams()),
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

    private voteReqBody(): JSONSchemaType<
        {
            pollSongId: string;
            action: "add";
        }[]
    > {
        return {
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
    }

    private getPollReqParams(): JSONSchemaType<{
        id: string;
    }> {
        return {
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
    }

    private createPollReqBody(): JSONSchemaType<{
        title: string;
        description: string | null;
        songs: { id: string; title: string; artist: string; album: string; albumImg: string }[];
    }> {
        return {
            type: "object",
            properties: {
                title: {
                    type: "string",
                },
                description: {
                    type: "string",
                    nullable: true,
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
            required: ["title", "description", "songs"],
            additionalProperties: false,
        };
    }

    private searchSongsReqQuery(): JSONSchemaType<{
        q: string;
        limit?: number;
        offset?: number;
    }> {
        return {
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
    }

    private getUserReqParams(): JSONSchemaType<{
        id: string;
    }> {
        return {
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
    }

    private getPollResultReqParams(): JSONSchemaType<{
        id: string;
    }> {
        return {
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
    }
}
