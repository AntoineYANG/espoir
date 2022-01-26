import { DependencySet, DependencyTag } from '@@install/utils/load-dependencies';
export declare type PackageAuthor = string | Partial<{
    name: string;
    email: string;
    url: string;
}>;
export declare type PackageJSON = Partial<{
    name: string;
    version: string;
    private: boolean;
    workspaces: string[];
    author: PackageAuthor;
    contributors: PackageAuthor[];
    repository: {
        type: 'git';
        url: string;
        directory: string;
    };
    bugs: {
        url: string;
    };
    homepage: string;
    bin: string | {
        [name: string]: string;
    };
    scripts: {
        [script: string]: string;
    };
    license: string;
    peerDependenciesMeta: Record<string, {
        optional: boolean;
    }>;
    [otherConfig: string]: any;
} & Record<DependencyTag, DependencySet>>;
export declare type EspoirCommitConfigs = {
    /** Types allowed to use */
    types: string[];
    /** Whether this commit can be run without changelog or not */
    optional: boolean;
    /** Valid format of commit message */
    format: string;
    /** Scopes allowed to use */
    scopes?: string[];
    /** Configurations of commit message subject */
    subject: {
        /** Minimum string length */
        min: number;
        /** Maximum string length */
        max: number;
        /** Valid pattern */
        pattern: RegExp;
    };
};
export declare type EspoirConfigs = {
    cacheDir: string;
    /** Configuration of espoir contribute feature */
    commit: EspoirCommitConfigs;
};
declare const _default: Readonly<{
    version: number;
    rootDir: string | null;
    rootPkg: Partial<{
        [otherConfig: string]: any;
        name: string;
        version: string;
        private: boolean;
        workspaces: string[];
        author: PackageAuthor;
        contributors: PackageAuthor[];
        repository: {
            type: "git";
            url: string;
            directory: string;
        };
        bugs: {
            url: string;
        };
        homepage: string;
        bin: string | {
            [name: string]: string;
        };
        scripts: {
            [script: string]: string;
        };
        license: string;
        peerDependenciesMeta: Record<string, {
            optional: boolean;
        }>;
    } & Record<DependencyTag, DependencySet>> | null;
    packages: string[] | null;
    packageMap: {
        [k: string]: Partial<{
            [otherConfig: string]: any;
            name: string;
            version: string;
            private: boolean;
            workspaces: string[];
            author: PackageAuthor;
            contributors: PackageAuthor[];
            repository: {
                type: "git";
                url: string;
                directory: string;
            };
            bugs: {
                url: string;
            };
            homepage: string;
            bin: string | {
                [name: string]: string;
            };
            scripts: {
                [script: string]: string;
            };
            license: string;
            peerDependenciesMeta: Record<string, {
                optional: boolean;
            }>;
        } & Record<DependencyTag, DependencySet>>;
    } | null;
    currentPackage: string | undefined;
    refresh: () => void;
    resolvePath: (...pathSegments: string[]) => string;
    resolvePathInPackage: (packageName: string, ...pathSegments: string[]) => string;
    runtime: {
        shell: string;
        espoir: {
            name: string;
            version: string;
            github: string;
        };
        npm: {
            registry: string;
        };
        node: {
            version: string;
        };
    };
    configs: Readonly<EspoirConfigs>;
}>;
export default _default;
